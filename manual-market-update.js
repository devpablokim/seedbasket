const axios = require('axios');

const FINNHUB_API_KEY = 'ct7fgm9r01qht2qng4v0ct7fgm9r01qht2qng4vg';
const FIREBASE_API_URL = 'https://us-central1-seedbasket-342ca.cloudfunctions.net/api';

async function triggerMarketUpdate() {
  console.log('🚀 시장 데이터 업데이트 트리거...');
  
  try {
    // First, get health check
    const healthResponse = await axios.get(`${FIREBASE_API_URL}/health`);
    console.log('✅ API 상태:', healthResponse.data);
    
    // Note: The /market/update endpoint requires authentication
    // For now, the scheduled function will handle updates automatically
    console.log('ℹ️  자동 업데이트가 30분마다 실행됩니다.');
    console.log('📊 Firebase Console에서 scheduledMarketUpdate 함수를 수동으로 실행할 수 있습니다:');
    console.log('   https://console.firebase.google.com/project/seedbasket-342ca/functions');
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

// 실행
triggerMarketUpdate();