# Orchestrate Skill

에이전트 팀을 조율하여 복잡한 기능을 구현하는 오케스트레이션 스킬.

## Trigger

- "기능 구현해줘", "화면이랑 API까지 전부 만들어줘"
- "풀스택으로 만들어줘", "end-to-end 구현"

## Architecture Pattern

**파이프라인 패턴** — 순차적 의존 작업을 단계별로 처리

```
feature-builder → api-integrator → ui-developer → qa-reviewer
```

## Pipeline Steps

### Step 1: Feature Scaffolding (feature-builder)
- FSD 규칙에 맞는 디렉토리 구조 생성
- 타입 정의 (types/)
- barrel export (index.ts)

### Step 2: API Integration (api-integrator)
- API 호출 함수 작성 (api/)
- TanStack Query hooks 생성 (hooks/)
- Zustand store 설정 (store/) — 필요 시

### Step 3: UI Development (ui-developer)
- 스크린 파일 생성 (app/)
- 피처별 UI 컴포넌트 (ui/)
- 공통 UI 컴포넌트 추가 (shared/ui/) — 필요 시
- 네비게이션 연결

### Step 4: QA Review (qa-reviewer)
- FSD 레이어 의존성 검증
- TypeScript 타입 체크
- ESLint + Prettier
- 보안 점검

## Data Flow Between Agents

```
feature-builder
  └─ outputs: directory structure, type definitions
       │
api-integrator
  └─ inputs: type definitions
  └─ outputs: API functions, query hooks, stores
       │
ui-developer
  └─ inputs: hooks, stores, types
  └─ outputs: screens, components
       │
qa-reviewer
  └─ inputs: all changed files
  └─ outputs: QA report, auto-fixes
```

## Error Handling

- 각 Step 실패 시 해당 에이전트가 자체 수정 시도
- 2회 실패 시 이전 Step의 output을 재검토
- 의존성 규칙 위반 발견 시 즉시 중단 후 수정

## Usage Example

```
"상품 목록/상세 기능을 만들어줘. API는 /products 엔드포인트"

→ Step 1: feature-builder가 src/features/product/ 스캐폴딩
→ Step 2: api-integrator가 상품 API 연동 + useProducts 훅 생성
→ Step 3: ui-developer가 상품 리스트/상세 스크린 생성
→ Step 4: qa-reviewer가 전체 검증
```
