const admin = require('firebase-admin');
const { updateMarketData } = require('../services/marketDataService');

// Initialize admin SDK with explicit project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'seedbasket-342ca'
  });
}

async function runMarketUpdate() {
  console.log('🚀 시장 데이터 업데이트 시작...');
  
  try {
    await updateMarketData();
    console.log('✅ 시장 데이터 업데이트 완료!');
  } catch (error) {
    console.error('❌ 시장 데이터 업데이트 실패:', error);
  }
}

// 실행
runMarketUpdate();