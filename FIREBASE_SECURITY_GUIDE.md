# Firebase API Key 보안 가이드

## 중요 사항
Firebase 웹 API 키는 실제로 공개되어도 안전하도록 설계되었습니다. 하지만 Google의 경고에 대응하여 추가 보안 조치를 취했습니다.

## 완료된 조치

1. **환경 변수 사용**
   - Firebase 설정을 환경 변수로 관리하도록 변경
   - 기본값은 유지하여 개발 편의성 확보

2. **Firebase Console에서 설정해야 할 사항**

### API 키 제한 설정
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)로 이동
2. 프로젝트 선택: `seedbasket-342ca`
3. API 키 찾기: `AIzaSyC7Uc70_Q7ynGZOeQNZKJNDYzSNn8P7A_k`
4. 해당 키 클릭하여 편집

### 애플리케이션 제한사항 설정
- **HTTP 리퍼러 (웹사이트)** 선택
- 허용된 도메인 추가:
  ```
  https://seedbasket-342ca.web.app/*
  https://seedbasket-342ca.firebaseapp.com/*
  http://localhost:3000/*
  ```

### API 제한사항 설정
- **키 제한** 선택
- 다음 API만 선택:
  - Firebase Auth API
  - Cloud Firestore API
  - Firebase Realtime Database API
  - Firebase Storage API
  - Identity Toolkit API

## Firebase Security Rules 확인
`firestore.rules` 파일에서 적절한 보안 규칙이 설정되어 있는지 확인:
- 인증된 사용자만 데이터 접근 가능
- 사용자별 데이터 격리
- 관리자 권한 제한

## 환경 변수 설정 (선택사항)
`.env.local` 파일 생성:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 참고 사항
- Firebase 웹 API 키는 클라이언트 사이드에서 사용되므로 노출은 불가피합니다
- 실제 보안은 Firebase Security Rules와 도메인 제한으로 처리됩니다
- 서버 사이드 키(Service Account)는 절대 노출되면 안 됩니다