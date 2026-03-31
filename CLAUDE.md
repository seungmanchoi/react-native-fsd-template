# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

React Native + Expo template with **Feature-Sliced Design (FSD)** architecture and **AI Agent Harness** for Claude Code.

## Tech Stack

- **Framework**: React Native 0.81 + Expo 54
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand (global) + TanStack Query (server)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Form & Validation**: React Hook Form + Zod
- **API**: Axios with token auto-refresh
- **TypeScript**: Strict mode

## Harness: Agent Team

이 프로젝트는 4개의 전문 에이전트로 구성된 하네스를 포함합니다.

| Agent | Role | File |
|-------|------|------|
| feature-builder | FSD 모듈 스캐폴딩 | `.claude/agents/feature-builder.md` |
| ui-developer | UI/스크린 개발 | `.claude/agents/ui-developer.md` |
| api-integrator | API 연동/상태관리 | `.claude/agents/api-integrator.md` |
| qa-reviewer | 품질 검증 | `.claude/agents/qa-reviewer.md` |

### Skills

| Skill | Trigger | File |
|-------|---------|------|
| create-feature | "피처 만들어줘" | `.claude/skills/create-feature/SKILL.md` |
| create-entity | "엔티티 만들어줘" | `.claude/skills/create-entity/SKILL.md` |
| create-screen | "스크린 추가해줘" | `.claude/skills/create-screen/SKILL.md` |
| orchestrate | "풀스택으로 만들어줘" | `.claude/skills/orchestrate/SKILL.md` |

### Pipeline Pattern

```
feature-builder → api-integrator → ui-developer → qa-reviewer
```

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
