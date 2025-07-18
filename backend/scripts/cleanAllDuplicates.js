const { firestore, FieldValue } = require('../config/firebase-admin');

async function cleanAllDuplicates() {
  console.log('Starting aggressive duplicate news cleanup...');
  
  try {
    // First, delete all news older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    console.log('Deleting news older than 7 days...');
    
    const oldNewsSnapshot = await firestore.collection('news')
      .where('publishedAt', '<', sevenDaysAgo)
      .get();
    
    console.log(`Found ${oldNewsSnapshot.size} old news articles to delete`);
    
    // Delete old news in batches
    const batchSize = 500;
    let deleted = 0;
    
    while (deleted < oldNewsSnapshot.size) {
      const batch = firestore.batch();
      const docs = oldNewsSnapshot.docs.slice(deleted, deleted + batchSize);
      
      docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      deleted += docs.length;
      console.log(`Deleted ${deleted} of ${oldNewsSnapshot.size} old articles`);
    }
    
    // Now get recent news and remove duplicates
    console.log('\nNow processing recent news for duplicates...');
    
    const recentNewsSnapshot = await firestore.collection('news')
      .where('publishedAt', '>=', sevenDaysAgo)
      .orderBy('publishedAt', 'desc')
      .get();
    
    console.log(`Found ${recentNewsSnapshot.size} recent news articles`);
    
    const uniqueArticles = new Map(); // URL -> article
    const titleMap = new Map(); // Normalized title -> article
    const toDelete = [];
    
    recentNewsSnapshot.docs.forEach(doc => {
      const article = { id: doc.id, ...doc.data() };
      
      // Check URL duplicate
      if (article.url && uniqueArticles.has(article.url)) {
        toDelete.push(doc.id);
        return;
      }
      
      // Check title duplicate
      const normalizedTitle = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(' ')
        .filter(word => word.length > 3)
        .sort()
        .join(' ');
      
      let foundDuplicate = false;
      
      for (const [existingTitle, existingArticle] of titleMap.entries()) {
        const existingWords = existingTitle.split(' ');
        const currentWords = normalizedTitle.split(' ');
        const commonWords = currentWords.filter(word => existingWords.includes(word));
        
        // If 80% similarity, it's a duplicate
        if (commonWords.length >= Math.max(currentWords.length, existingWords.length) * 0.8) {
          // Keep the newer one
          if (new Date(article.publishedAt) > new Date(existingArticle.publishedAt)) {
            toDelete.push(existingArticle.id);
            titleMap.set(existingTitle, article);
            if (article.url) uniqueArticles.set(article.url, article);
          } else {
            toDelete.push(doc.id);
          }
          foundDuplicate = true;
          break;
        }
      }
      
      if (!foundDuplicate) {
        titleMap.set(normalizedTitle, article);
        if (article.url) uniqueArticles.set(article.url, article);
      }
    });
    
    console.log(`Found ${toDelete.length} duplicate articles to delete`);
    
    // Delete duplicates
    deleted = 0;
    while (deleted < toDelete.length) {
      const batch = firestore.batch();
      const ids = toDelete.slice(deleted, deleted + batchSize);
      
      ids.forEach(id => {
        batch.delete(firestore.collection('news').doc(id));
      });
      
      await batch.commit();
      deleted += ids.length;
      console.log(`Deleted ${deleted} of ${toDelete.length} duplicates`);
    }
    
    console.log('\nCleanup completed!');
    console.log(`Total articles deleted: ${oldNewsSnapshot.size + toDelete.length}`);
    console.log(`Remaining articles: ${titleMap.size}`);
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
}

// Run the cleanup
cleanAllDuplicates();