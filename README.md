# MealMate - React + TypeScript 시간표 기반 밥약 매칭 서비스

## 프로젝트 개요
- **이름**: MealMate
- **목표**: 에브리타임 시간표 이미지를 분석하여 같은 시간대에 여유가 있는 학생들을 매칭해주는 밥약 서비스
- **프론트엔드**: React + TypeScript (완전 새로운 구현)
- **백엔드**: Hono Framework + Cloudflare Workers
- **주요 기능**: 
  - AI 기반 시간표 이미지 분석
  - 스마트 매칭 알고리즘
  - 실시간 밥약 요청 및 매칭
  - 컴포넌트 기반 모던 UI

## 서비스 URL
- **개발 서버**: https://3000-ikpe9gkmemj2sziznkgrk-6532622b.e2b.dev
- **GitHub**: https://github.com/sONg20NOW/Everytime_meeting_with_rice

## 기술 스택

### 🔥 **Frontend (New!)**
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 완전한 타입 안전성
- **TailwindCSS** - 모던 반응형 디자인
- **Custom Hooks** - 상태 관리 및 비즈니스 로직 분리
- **Axios** - HTTP 클라이언트
- **Vite** - 빠른 개발 환경

### 🚀 **Backend**
- **Hono Framework** - 경량 웹 프레임워크
- **TypeScript** - 서버사이드 타입 안전성
- **Cloudflare Workers** - 엣지 컴퓨팅

### 💾 **Database & Storage**
- **Cloudflare D1** - SQLite 기반 글로벌 DB
- **Cloudflare R2** - 이미지 스토리지
- **Cloudflare AI** - 시간표 분석 (LLaVA 모델)

## 프로젝트 구조

```
webapp/
├── client/                 # React Frontend
│   └── src/
│       ├── components/     # React 컴포넌트
│       ├── hooks/          # Custom React Hooks
│       ├── types/          # TypeScript 타입 정의
│       ├── utils/          # 유틸리티 함수
│       └── App.tsx         # 메인 App 컴포넌트
├── src/
│   └── server.tsx          # Hono 백엔드 서버
├── migrations/             # 데이터베이스 마이그레이션
├── public/                 # 정적 파일
└── dist/                   # 빌드 결과물
```

## React 컴포넌트 구조

### 📱 **컴포넌트 아키텍처**
- **App.tsx** - 메인 애플리케이션 컨테이너
- **AuthForm** - 로그인/회원가입 폼
- **TimetableUpload** - 시간표 이미지 업로드
- **MatchingForm** - 밥약 매칭 요청 폼
- **MatchList** - 매칭 결과 목록 표시
- **UserStatus** - 사용자 상태 표시
- **LoadingModal** - 로딩 상태 모달

### 🪝 **Custom Hooks**
- **useAuth** - 사용자 인증 상태 관리
- **useTimetable** - 시간표 업로드/조회 로직
- **useMatches** - 매칭 요청/관리 로직

### 🎯 **TypeScript 타입 시스템**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  university: string;
}

interface Course {
  course_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Match {
  id: number;
  meal_type: 'lunch' | 'dinner';
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

## 현재 완료된 기능

### ✅ **React Frontend**
- **컴포넌트 기반 아키텍처** - 재사용 가능한 모듈식 구조
- **완전한 타입 안전성** - TypeScript로 모든 데이터 타입 정의
- **반응형 디자인** - 모바일/데스크톱 완벽 지원
- **상태 관리** - React Hooks 기반 효율적 상태 관리
- **실시간 UI 업데이트** - 사용자 액션에 즉각 반응
- **로컬 스토리지 연동** - 사용자 세션 자동 복원

### ✅ **핵심 기능**
- **사용자 인증** - 간편 로그인/회원가입
- **시간표 분석** - AI 기반 이미지 분석 (로컬에서는 샘플 데이터)
- **스마트 매칭** - 시간 충돌 검사 알고리즘
- **실시간 매칭** - 즉시 매칭 결과 확인
- **매칭 관리** - 확정/취소 기능

### ✅ **API 엔드포인트**
- `POST /api/users` - 사용자 등록/로그인
- `POST /api/timetables/analyze` - 시간표 이미지 분석
- `GET /api/users/:userId/timetables` - 사용자 시간표 조회
- `POST /api/match-requests` - 매칭 요청 생성
- `GET /api/users/:userId/matches` - 매칭 결과 조회
- `PATCH /api/matches/:matchId` - 매칭 상태 업데이트

## 사용자 가이드

### 1. 회원가입/로그인
- 이메일, 이름, 대학교 정보 입력
- 자동으로 계정 생성 및 로그인

### 2. 시간표 등록
- 에브리타임 시간표 스크린샷 업로드
- AI가 자동으로 수업 정보 분석 (프로덕션에서)
- 로컬 개발환경에서는 샘플 데이터 제공

### 3. 밥약 매칭
- 식사 종류, 날짜, 시간대 설정
- 실시간 매칭 알고리즘 실행
- 매칭 결과 즉시 확인

### 4. 매칭 관리
- 매칭 확정/취소 버튼으로 상태 관리
- 상대방 연락처 정보 확인
- 실시간 상태 업데이트

## 개발 환경 설정

### 🛠️ **로컬 개발**
```bash
# 의존성 설치
npm install

# 데이터베이스 설정
npm run db:migrate:local
npm run db:seed

# 개발 서버 시작
npm run build
npm run dev:sandbox
```

### 🚀 **프로덕션 배포**
```bash
# 빌드
npm run build

# Cloudflare Pages 배포
npm run deploy
```

## 성능 최적화

### ⚡ **Frontend 최적화**
- **코드 스플리팅** - Vite 기반 자동 번들 최적화
- **TreeShaking** - 미사용 코드 자동 제거
- **CSS 최적화** - TailwindCSS 퍼지 기능
- **타입 체크** - 런타임 오류 사전 방지

### 🔧 **Backend 최적화**
- **엣지 컴퓨팅** - Cloudflare Workers 글로벌 배포
- **데이터베이스** - D1 SQLite 최적화된 쿼리
- **이미지 저장** - R2 스토리지 CDN 활용

## 배포 상태
- **현재 상태**: ✅ React + TypeScript 개발 서버 활성화
- **플랫폼**: Cloudflare Pages (준비됨)
- **프론트엔드**: React 19 + TypeScript
- **백엔드**: Hono + Cloudflare Workers
- **최종 업데이트**: 2024년 9월 22일

## 다음 개발 단계

### 🔄 **UI/UX 개선**
1. **애니메이션** - Framer Motion 도입
2. **다크모드** - 테마 시스템 구축
3. **PWA** - 모바일 앱화
4. **성능 모니터링** - React DevTools 연동

### 🚀 **기능 확장**
1. **실시간 알림** - WebSocket 연동
2. **그룹 매칭** - 다중 사용자 매칭
3. **리뷰 시스템** - 매칭 후 평가
4. **소셜 기능** - 친구 시스템

## 개발자 정보
- **프론트엔드**: React + TypeScript 완전 새로운 구현
- **개발 기간**: 2024년 9월 22일
- **개발 도구**: Claude + React + Hono Framework
- **코드 저장소**: GitHub (체계적인 커밋 히스토리)