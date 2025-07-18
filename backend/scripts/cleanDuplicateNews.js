const { firestore } = require('../config/firebase-admin');

async function cleanDuplicateNews() {
  console.log('Starting duplicate news cleanup...');
  
  try {
    // Get all news
    const snapshot = await firestore.collection('news')
      .orderBy('publishedAt', 'desc')
      .get();
    
    const allNews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${allNews.length} total news articles`);
    
    const seenTitles = new Map(); // Map of normalized title to document ID
    const duplicateIds = [];
    
    for (const article of allNews) {
      const titleWords = article.title.toLowerCase()
        .split(' ')
        .filter(word => word.length > 3)
        .sort()
        .join(' ');
      
      let isDuplicate = false;
      
      // Check if we've seen a similar title
      for (const [seenTitle, seenId] of seenTitles.entries()) {
        const seenWords = seenTitle.split(' ');
        const currentWords = titleWords.split(' ');
        const commonWords = currentWords.filter(word => seenWords.includes(word));
        
        // If 70% or more words match, consider it duplicate
        if (commonWords.length >= Math.min(currentWords.length, seenWords.length) * 0.7) {
          isDuplicate = true;
          duplicateIds.push(article.id);
          console.log(`Duplicate found: "${article.title}"`);
          break;
        }
      }
      
      if (!isDuplicate) {
        // Also check URL duplicates
        const existingWithUrl = Array.from(seenTitles.values()).find(id => {
          const existing = allNews.find(n => n.id === id);
          return existing && existing.url === article.url;
        });
        
        if (existingWithUrl) {
          duplicateIds.push(article.id);
          console.log(`URL duplicate found: "${article.title}"`);
        } else {
          seenTitles.set(titleWords, article.id);
        }
      }
    }
    
    console.log(`Found ${duplicateIds.length} duplicate articles`);
    
    // Delete duplicates in batches
    if (duplicateIds.length > 0) {
      const batchSize = 500;
      for (let i = 0; i < duplicateIds.length; i += batchSize) {
        const batch = firestore.batch();
        const batchIds = duplicateIds.slice(i, i + batchSize);
        
        batchIds.forEach(id => {
          batch.delete(firestore.collection('news').doc(id));
        });
        
        await batch.commit();
        console.log(`Deleted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(duplicateIds.length / batchSize)}`);
      }
    }
    
    console.log('Cleanup completed!');
    
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
  }
}

// Run the cleanup
cleanDuplicateNews();