# FSD Architecture Rules Reference

## Layer Hierarchy

```
app (routing) → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 참조 가능
- 동일 레이어 간 직접 참조 금지
- 모든 모듈은 barrel export (index.ts)를 통해서만 접근

## Layer Definitions

| Layer | Purpose | Can Import |
|-------|---------|------------|
| `app/` | Expo Router 라우팅 | widgets, features, entities, shared |
| `src/widgets/` | 독립 UI 블록 | features, entities, shared |
| `src/features/` | 비즈니스 기능 | entities, shared |
| `src/entities/` | 도메인 모델 | shared |
| `src/shared/` | 공통 유틸리티 | 외부 라이브러리만 |

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Directory | kebab-case | `my-feature/` |
| Interface | `I` prefix | `IUserState` |
| Type | `T` prefix | `TButtonVariant` |
| Enum | `E` prefix | `EUserRole` |
| Hook file | `use-` prefix | `use-login.ts` |
| API file | `.api.ts` suffix | `auth.api.ts` |
| Store file | `.store.ts` suffix | `user.store.ts` |
| Type file | `.types.ts` suffix | `auth.types.ts` |
| Component | PascalCase | `Button.tsx` |

## Import Rules

- Always use path alias: `@/`, `@shared/`, `@features/`, `@entities/`, `@widgets/`, `@core/`
- Never use relative imports across layers (e.g., `../../shared/`)
- Import from barrel export only (e.g., `from '@features/auth'`, not `from '@features/auth/hooks/use-login'`)
