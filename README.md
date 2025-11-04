# Generation Bridge AI Platform

세대소통 AI 플랫폼 - Generation Bridge Project

## 🎯 프로젝트 개요

Generation Bridge는 AI 기술을 활용하여 세대 간 언어·문화·감정 격차를 해소하고, 공감 기반의 소통을 돕는 혁신적인 플랫폼입니다.

### 핵심 서비스
- **ZLang**: 신조어 변환 웹앱 - AI가 세대별 언어를 자연스럽게 번역
- **GenQuiz**: 세대공감 퀴즈 - 재미있는 퀴즈로 다른 세대 이해
- **TalkBridge**: 대화 리포터 - 대화 분석 및 소통 개선점 제안

## 🚀 기술 스택

- **Frontend**: Vite + React + TypeScript + TailwindCSS
- **Backend**: Firebase (Auth + Firestore + Functions)
- **AI Core**: OpenAI GPT API + Emotion Analysis
- **Deployment**: Vercel + Cloudflare DNS
- **Animation**: Framer Motion
- **Visualization**: Chart.js

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm or yarn

### 설치
```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어서 실제 API 키들로 수정하세요
```

### 환경변수 설정
`.env` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 🎨 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트
│   └── Layout.tsx      # 메인 레이아웃 및 네비게이션
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈페이지
│   ├── ZLangPage.tsx   # 신조어 변환
│   ├── GenQuizPage.tsx # 세대공감 퀴즈
│   └── TalkBridgePage.tsx # 대화 리포터
├── lib/                # 외부 서비스 연동
│   ├── firebase.ts     # Firebase 설정
│   └── openai.ts       # OpenAI API 클라이언트
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 전역 타입
├── hooks/              # 커스텀 React Hooks
├── utils/              # 유틸리티 함수
└── styles/             # 스타일 관련
```

## 🌟 주요 기능

### ZLang - 신조어 변환
- AI 기반 세대별 언어 번역
- 실시간 신뢰도 표시
- 사용 예시 및 설명 제공
- 음성 읽기 및 복사 기능

### GenQuiz - 세대공감 퀴즈
- 세대별 맞춤 퀴즈 생성
- 실시간 점수 및 분석
- 세대 이해도 측정
- 상세한 해설 제공

### TalkBridge - 대화 리포터
- 감정 분석 및 시각화
- 세대별 소통 스타일 분석
- 개선점 제안
- 음성 입력 지원

## 🎯 사업 목표

### 정량적 목표
- 3개 기관 파일럿 서비스 적용
- 참여자 300명 이상 확보
- 사용자 만족도 90% 이상

### 정성적 목표
- 세대소통 프로그램 활성화
- "세대이해 교육" 콘텐츠 확대
- 브랜드 이미지 제고 (사회적 가치)

## 🚀 향후 계획

### 1단계 (현재)
- MVP 개발 완료
- 3종 플랫폼 구축 (ZLang, GenQuiz, TalkBridge)

### 2단계 (2025.12 - 2026.02)
- 복지관/도서관/학교 시범 서비스
- 사용자 피드백 수집 및 개선

### 3단계 (2026.03~)
- 음성·이미지 인식 추가
- 다국어 지원
- 공공 SaaS 서비스 확장

## 📄 라이센스

이 프로젝트는 바이칼시스템즈(Baikal Systems)의 소유입니다.

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

- **주관기관**: 바이칼시스템즈 (Baikal Systems)
- **프로젝트 기간**: 2025.11 ~ 2026.03
- **문의사항**: [연락처 정보]

---

> 💬 "기술은 세대를 잇는 다리입니다." - Generation Bridge Team
