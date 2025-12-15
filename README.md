# PBFLIX – TMDB 기반 SPA 과제

React 19 + Vite + TypeScript 조합으로 만든 영화 추천 SPA입니다. 가입/로그인, TMDB 연동, 위시리스트, 검색/필터링, 테이블/무한 스크롤 등 과제 요구사항을 모두 반영했습니다.

## 핵심 기능
- **인증 & 로컬 스토리지**: 이메일 + TMDB API Key 조합으로 회원가입/로그인. Remember me, Keep login, 추천 영화, 검색 히스토리를 모두 Local Storage에 보관.
- **SPA 라우팅 & 전환 효과**: `/`, `/popular`, `/search`, `/wishlist`, `/signin` 라우트 구성. 미들웨어(RequireAuth)로 보호하며 페이지 전환/헤더 스크롤 애니메이션 적용.
- **TMDB 연동**: Axios를 통해 인기/상영중/평점/개봉예정/검색 API를 호출하고 로딩 상태·에러를 토스트로 안내.
- **추천(위시리스트)**: 포스터 클릭 시 추천 목록에 즉시 반영, 다른 디자인과 별도 페이지(`/wishlist`)로 확인/삭제 가능.
- **대세 콘텐츠 페이지**: Table View(페이지네이션, 스크롤 잠금)와 Infinite Scroll을 토글하며 요구된 UI/UX를 모두 제공.
- **검색 & 필터/정렬**: 장르/평점/정렬 기준 필터, 최근 검색 히스토리 칩, 조건 불러오기/초기화.
- **반응형 & 애니메이션**: 모바일 대응 레이아웃, 카드 호버 확대, 로그인 카드 전환, Header 투명도 변경, 페이지 페이드 등 CSS Transition/Animation 다수.

## 기술 스택
- **Framework**: React 19, React Router DOM 7
- **빌드**: Vite 7, TypeScript 5
- **HTTP/상태**: Axios, Custom Hooks (`useWishlist`, `useLockScroll`)
- **UI/UX**: react-hot-toast, CSS Modules(단일 글로벌 스타일)

## 설치 & 실행
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입체크 + 프로덕션 번들
npm run preview  # 빌드 미리보기
npm run deploy   # gh-pages 브랜치 배포
```

> ✨ 회원가입/로그인 시 **TMDB API Key**를 비밀번호 자리에 입력해야 API 인증이 통과합니다.

## 환경 변수
`VITE_TMDB_BASE_URL` (기본값 `https://api.themoviedb.org/3`)만 사용합니다. 필요 시 `.env` 에 덮어쓰세요.

## 폴더 구조
```
src/
 ├─ api/        # TMDB 호출 래퍼 및 타입
 ├─ components/ # Header, Layout, MovieRow 등 재사용 컴포넌트
 ├─ hooks/      # useWishlist, useLockScroll 등 커스텀 훅
 ├─ pages/      # Route 별 화면 (Home/Popular/Search/Wishlist/SignIn)
 ├─ router/     # HashRouter + RequireAuth 설정
 ├─ styles/     # 글로벌 스타일 (globals.css)
 └─ utils/      # auth/storage 헬퍼
```

## 페이지 요약
- **/signin**: 회원가입/로그인을 하나의 카드에서 애니메이션 전환. Remember me, Keep login, 약관 동의, 토스트 메시지 포함.
- **/**: 상영중/인기/평점/개봉예정 4가지 TMDB 리스트를 행(Row) 컴포넌트로 렌더링.
- **/popular**: 버튼으로 Table View ↔ Infinite Scroll 전환. Table은 페이지네이션 + 스크롤 잠금 + 포스터별 액션, Infinite는 IntersectionObserver 기반 무한 스크롤과 Top 버튼.
- **/search**: 장르/평점/정렬 필터, 검색 히스토리 칩, 조건 불러오기, 결과 카드 클릭으로 위시리스트 토글.
- **/wishlist**: API 호출 없이 Local Storage 데이터만 사용. 카드 클릭으로 개별 삭제, 전체 삭제 버튼 제공.

## Local Storage 사용 키
- `users`, `loginUser`, `keepLogin`, `rememberEmail`, `rememberEmail:enabled`
- `movieWishlist` (추천 영화), `searchHistory` (최근 검색)
- `TMDb-Key` (API 요청 헤더에서 사용)

## GitFlow & 작업 규칙
- `main`: 배포 브랜치, `develop`: 통합 브랜치.
- 개별 기능은 `feature/*` 브랜치에서 작업 후 PR → 코드 리뷰 → `develop` 머지.
- 배포 전 `release/*`, 긴급 수정은 `hotfix/*` 브랜치 사용.
- 커밋 메시지는 `type: summary` 규칙(ex. `feat: add wishlist page`)을 따릅니다.

## 배포 메모
- `npm run deploy` 가 `dist/` 를 gh-pages 브랜치로 push.
- Netlify/GitHub Pages 둘 다 동작하도록 정적 번들이 dist에 생성됩니다.

## AI 서비스 활용
1. **Role Prompting (UI/UX 코치)** – GPT에게 “Netflix 스타일의 다크 테마 헤더/카드 애니메이션을 React + CSS만으로 구현하는 팁”을 요청해 header 투명도, 카드 hover 값을 도출.
2. **Chain-of-Thought Prompting (문서 보조)** – Claude에게 README 구성을 단계별로 질문하여 프로젝트 개요 → 설치 → GitFlow → AI 활용 순서로 자연스러운 문서를 설계.

위 두 가지 프롬프트 전략으로 디자인/문서 품질과 작업 속도를 동시에 끌어올렸습니다.
