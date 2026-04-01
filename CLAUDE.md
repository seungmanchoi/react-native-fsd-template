# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

React Native + Expo template with **Feature-Sliced Design (FSD)** architecture and **AI Agent Harness** for full lifecycle app development with Claude Code.

## Tech Stack

- **Framework**: React Native 0.81 + Expo 54
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand (global) + TanStack Query (server)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Form & Validation**: React Hook Form + Zod
- **API**: Axios with token auto-refresh
- **TypeScript**: Strict mode

## Harness Engineering Rules (MANDATORY)

**이 프로젝트의 모든 작업은 아래 하네스 규칙을 따른다.** 에이전트와 스킬을 반드시 활용하여 작업한다.

### 핵심 규칙

1. **새 기능 구현 시**: 반드시 FSD 구조 규칙을 따른다. feature/entity/widget 생성 시 해당 에이전트 정의 파일(`.claude/agents/`)을 Read하고 지시를 따른다.
2. **풀 앱 개발 시**: `/orchestrate` 스킬의 7-Phase 파이프라인을 따른다. Phase를 건너뛰지 않는다.
3. **QA는 생략할 수 없다**: 구현 완료 후 반드시 `npm run typecheck`, `npm run lint`를 실행한다. Hard Threshold 기준을 적용한다.
4. **`_workspace/` 디렉토리**: 에이전트 간 데이터는 `_workspace/`에 파일로 저장하여 전달한다. Phase 전환 시 이전 산출물을 Read하고 이어서 작업한다.
5. **디자인 변경 시**: `design-architect` 에이전트의 4축 평가 기준(Design Quality, Originality, Craft, Functionality)을 적용한다.
6. **배포 시**: `/store-deploy` 스킬을 사용한다. 다른 배포 방법을 사용하지 않는다.

### Hard Thresholds (위반 시 작업 FAIL)

| 기준 | 임계값 |
|------|--------|
| `npm run typecheck` 오류 | **0개** |
| `npm run lint` 에러 | **0개** |
| `any` 타입 사용 | **0개** |
| FSD 레이어 의존성 위반 | **0개** |
| SafeAreaView 누락 (스크린) | **0개** |
| barrel export 누락 | **0개** |

### 에이전트 활용 매핑

| 작업 유형 | 사용할 에이전트 | 참조 파일 |
|----------|--------------|----------|
| 아이디어/리서치 | `idea-researcher` | `.claude/agents/idea-researcher.md` |
| 기획/PRD | `product-planner` | `.claude/agents/product-planner.md` |
| 디자인/테마 | `design-architect` | `.claude/agents/design-architect.md` |
| FSD 모듈 생성 | `feature-builder` | `.claude/agents/feature-builder.md` |
| API/상태관리 | `api-integrator` | `.claude/agents/api-integrator.md` |
| UI/스크린 | `ui-developer` | `.claude/agents/ui-developer.md` |
| 코드 품질 | `qa-reviewer` | `.claude/agents/qa-reviewer.md` |
| 기능/UX 검수 | `app-inspector` | `.claude/agents/app-inspector.md` |

## Agent Team & Skills

이 프로젝트는 8개의 전문 에이전트와 8개의 스킬로 구성된 AI Agent Harness를 포함합니다.

### Agents

| Agent | Role | File |
|-------|------|------|
| `idea-researcher` | 시장 조사, 앱 아이디어 도출 | `.claude/agents/idea-researcher.md` |
| `product-planner` | PRD, FSD 모듈 맵, 유저 스토리 | `.claude/agents/product-planner.md` |
| `design-architect` | 디자인 시스템, NativeWind 테마 | `.claude/agents/design-architect.md` |
| `feature-builder` | FSD 모듈 스캐폴딩 | `.claude/agents/feature-builder.md` |
| `api-integrator` | Axios + TanStack Query + Zustand | `.claude/agents/api-integrator.md` |
| `ui-developer` | NativeWind 스크린 & UI 컴포넌트 | `.claude/agents/ui-developer.md` |
| `qa-reviewer` | 코드 품질, TypeScript, FSD 규칙 | `.claude/agents/qa-reviewer.md` |
| `app-inspector` | 기능/UX 검사, Safe Area, 접근성 | `.claude/agents/app-inspector.md` |

### Skills

| Skill | Command | Description |
|-------|---------|-------------|
| `ideate` | "앱 아이디어 찾아줘" | 시장 조사 및 앱 아이디어 도출 |
| `plan-app` | "앱 기획해줘" | PRD 작성 및 FSD 모듈 맵 설계 |
| `design-system` | "디자인 시스템 만들어줘" | NativeWind 테마 및 화면 레이아웃 |
| `create-feature` | "피처 만들어줘" | FSD feature 모듈 스캐폴딩 |
| `create-entity` | "엔티티 만들어줘" | FSD entity 도메인 모델 생성 |
| `create-screen` | "스크린 추가해줘" | Expo Router 스크린 생성 |
| `inspect-app` | "앱 검사해줘" | 기능/UX 전체 검사 |
| `orchestrate` | "앱 만들어줘" | 전체 파이프라인 오케스트레이션 |

### Full Pipeline

```
Phase 1: Ideation      — idea-researcher  (/ideate)
Phase 2: Planning      — product-planner  (/plan-app)
Phase 3: Design        — design-architect (/design-system)
Phase 4: Implementation (순차)
  4a feature-builder   (/create-feature, /create-entity)
  4b api-integrator
  4c ui-developer      (/create-screen)
Phase 5: QA (병렬)
  5a qa-reviewer
  5b app-inspector     (/inspect-app)
Phase 6: Iteration     — Fix Loop (최대 3회)
Phase 7: Deployment    — /store-deploy
```

데이터 흐름: `_workspace/` 디렉토리를 통해 에이전트 간 컨텍스트 전달.

## Branch Strategy

```
main     <- Production
  ^
devel    <- Development (default)
  ^
feature/* <- Feature branches
```

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server (LAN)
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier
```

## Architecture: Feature-Sliced Design (FSD)

```
src/
├── core/          # App initialization, providers
├── features/      # Business logic (auth, etc.)
├── entities/      # Domain models (user, etc.)
├── widgets/       # Independent UI blocks
└── shared/        # Shared utilities
    ├── api/       # API client (Axios)
    ├── config/    # Environment, theme
    ├── lib/       # Hooks, utils
    ├── types/     # Common types
    └── ui/        # Reusable UI components
```

**Dependency Rule**: Upper layers may only reference lower layers.
`app -> widgets -> features -> entities -> shared`

## Feature Structure Convention

```
features/{name}/
├── api/           # API calls
├── hooks/         # Custom hooks (useQuery, useMutation)
├── store/         # Zustand store (if needed)
├── types/         # TypeScript types
├── ui/            # UI components
└── index.ts       # Public API (barrel export)
```

## Code Conventions

- No `any` type in production code
- Safe area handling is mandatory for all screens (use `SafeAreaView` / `react-native-safe-area-context`)
- Interface prefix: `I`, Type prefix: `T`, Enum prefix: `E`
- Separate files for interfaces, types, enums
- Use `@/` alias for imports
- Run lint, typecheck, prettier after changes
