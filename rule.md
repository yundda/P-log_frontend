# 프론트엔드 규칙

### commit convention

- [feat] 250331: 내가 한 일 (완료)
- [feat] 250331: 내가 한 일 (진행중)
  - feat, fix, docs, style, refactor, chore

### React style

- sass, styled-compnents
- tailwind 사용
- Tailwind 사용
  ✔ 레이아웃 → flex, grid, gap, p-4, m-2 등
  ✔ 빠른 스타일링 → 버튼, 카드 등 간단한 요소
  ✔ 유틸리티 스타일 → 색상, 폰트, 간격 등 (text-gray-700, bg-blue-500)
  ✔ 공통 스타일 → @apply 사용
- SCSS 사용
  ✔ 반응형 스타일 → @media (max-width: 923px) {...}
  ✔ 중첩 스타일 → &:hover, &::after✔ 커스텀 애니메이션 → @keyframes
  ✔ 변수 & 믹스인 → $primary-color, @mixin

- Tailwind → 빠르고 간단한 스타일 SCSS → 반응형 & 복잡한 스타일

### 함수

- camelCase
- jsDocs 사용 여부 >> 고민..

### 컴포넌트 관리 규칙

- 아토믹 디자인 패턴
- 페이지 별로 컴포넌트 관리
