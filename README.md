# React Native FSD Template

React Native + Expo template with **Feature-Sliced Design (FSD)** architecture.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.81 + Expo 54 |
| Language | TypeScript (strict mode) |
| Routing | Expo Router (file-based) |
| Global State | Zustand |
| Server State | TanStack Query |
| Styling | NativeWind (Tailwind CSS) |
| Form | React Hook Form + Zod |
| API | Axios (auto token refresh) |
| Lint | ESLint + Prettier |
| Build | EAS Build |

## Getting Started

### 1. Use this template

GitHub에서 **"Use this template"** 버튼을 클릭하거나:

```bash
gh repo create my-app --template seungmanchoi/react-native-fsd-template --clone
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

`.env` 파일을 수정하여 API URL 등을 설정합니다.

### 4. Run

```bash
npm start          # Expo Dev Server (LAN)
npm run ios        # iOS Simulator
npm run android    # Android Emulator
```

## Project Structure

```
.
├── app/                            # Expo Router (file-based routing)
│   ├── _layout.tsx                 # Root layout (providers)
│   ├── (auth)/                     # Auth group (unauthenticated)
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── (tabs)/                     # Tab group (authenticated)
│       ├── _layout.tsx             # Bottom tabs (Home, Explore, Profile)
│       ├── index.tsx
│       ├── explore.tsx
│       └── profile.tsx
│
├── src/
│   ├── core/                       # App initialization
│   │   └── providers/              # QueryProvider, ThemeProvider
│   │
│   ├── features/                   # Business logic features
│   │   └── auth/                   # Example: authentication
│   │       ├── api/                # API calls
│   │       ├── hooks/              # useLogin, useSignup
│   │       ├── types/              # ILoginRequest, ILoginResponse
│   │       └── index.ts            # Public API
│   │
│   ├── entities/                   # Domain models
│   │   └── user/                   # Example: user entity
│   │       ├── api/                # User API
│   │       ├── store/              # Zustand store
│   │       ├── types/              # IUser
│   │       └── index.ts            # Public API
│   │
│   ├── widgets/                    # Independent UI blocks
│   │
│   └── shared/                     # Shared code
│       ├── api/                    # Axios client + token management
│       ├── config/                 # Environment, theme
│       ├── lib/                    # Custom hooks, utils
│       ├── types/                  # Common types
│       └── ui/                     # UI components
│           ├── Button.tsx
│           ├── Card.tsx
│           ├── Input.tsx
│           ├── Typography.tsx
│           ├── ErrorBoundary.tsx
│           └── Toast/
│
├── app.config.ts                   # Expo config (dynamic)
├── tailwind.config.js              # NativeWind/Tailwind config
├── tsconfig.json                   # TypeScript (path aliases)
├── .eslintrc.js                    # ESLint rules
├── .prettierrc.js                  # Prettier rules
└── eas.json                        # EAS Build profiles
```

## FSD Architecture

**Feature-Sliced Design**은 비즈니스 도메인별로 코드를 구성하는 아키텍처입니다.

### Layer Hierarchy

```
app (routing) → widgets → features → entities → shared
```

상위 레이어는 하위 레이어만 참조할 수 있습니다. 동일 레벨 간 직접 참조는 금지합니다.

### Adding a New Feature

```
src/features/my-feature/
├── api/
│   ├── my-feature.api.ts       # API calls
│   └── index.ts
├── hooks/
│   ├── use-my-feature.ts       # Custom hooks
│   └── index.ts
├── store/                       # (optional) Zustand store
│   ├── my-feature.store.ts
│   └── index.ts
├── types/
│   ├── my-feature.types.ts     # Interfaces, types
│   └── index.ts
├── ui/                          # (optional) Feature-specific UI
│   ├── MyComponent.tsx
│   └── index.ts
└── index.ts                     # Public API (barrel export)
```

### Adding a New Entity

```
src/entities/my-entity/
├── api/
│   ├── my-entity.api.ts
│   └── index.ts
├── store/
│   ├── my-entity.store.ts
│   └── index.ts
├── types/
│   ├── my-entity.types.ts
│   └── index.ts
└── index.ts
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@core/*` | `./src/core/*` |
| `@features/*` | `./src/features/*` |
| `@entities/*` | `./src/entities/*` |
| `@widgets/*` | `./src/widgets/*` |
| `@shared/*` | `./src/shared/*` |

```typescript
// Example
import { Button } from '@shared/ui';
import { useLogin } from '@features/auth';
import { useUserStore } from '@entities/user';
```

## Available Scripts

```bash
npm start              # Dev server (LAN mode)
npm run start:local    # Dev server (localhost)
npm run start:tunnel   # Dev server (tunnel)
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run web            # Run on Web
npm run lint           # ESLint check
npm run typecheck      # TypeScript check
npm run format         # Prettier format
npm run eas:build:dev  # EAS development build
npm run eas:build:prod # EAS production build
```

## Customization

### 1. App name & identifiers

`app.config.ts`에서 수정:

```typescript
name: 'MyApp',              // 앱 이름
slug: 'my-app',             // URL slug
scheme: 'myapp',            // Deep link scheme
// iOS
bundleIdentifier: 'com.myapp.app',
// Android
package: 'com.myapp.app',
```

### 2. Theme colors

`tailwind.config.js`에서 primary 색상 변경:

```javascript
colors: {
  primary: {
    500: '#your-color',
    // ...
  },
},
```

`src/shared/config/theme.ts`에서 상세 테마 수정.

### 3. API URL

`.env` 파일:

```
API_URL=http://your-api-server:3000
```

### 4. EAS Build

```bash
eas build:configure    # EAS 초기 설정
```

`eas.json`에서 빌드 프로필 수정.

## Naming Conventions

| Type | Prefix | Example |
|------|--------|---------|
| Interface | `I` | `IUserState` |
| Type | `T` | `TButtonVariant` |
| Enum | `E` | `EUserRole` |
| Hook | `use-` | `use-login.ts` |
| Component | PascalCase | `Button.tsx` |
| Util | camelCase | `auth-utils.ts` |

## Branch Strategy

```
main      ← Production
  ^
devel     ← Development (default)
  ^
feature/* ← Feature branches
```

## License

MIT
