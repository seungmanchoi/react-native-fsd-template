# Create Feature Skill

FSD 아키텍처 규칙에 따라 새 feature 모듈을 생성하는 스킬.

## Trigger

- "피처 만들어줘", "feature 추가해줘", "새 기능 만들어줘"
- `/create-feature {name}`

## Input

- `name`: feature 이름 (kebab-case, 예: `my-feature`)
- `with-ui`: UI 컴포넌트 포함 여부 (optional, default: false)
- `with-store`: Zustand store 포함 여부 (optional, default: false)

## Steps

### Step 1: 이름 검증
- kebab-case 형식 확인
- 기존 feature와 이름 중복 확인 (`src/features/` 검색)

### Step 2: 디렉토리 구조 생성

```
src/features/{name}/
├── api/
│   ├── {name}.api.ts          # API 호출 함수
│   └── index.ts
├── hooks/
│   ├── use-{name}.ts          # TanStack Query hooks
│   └── index.ts
├── types/
│   ├── {name}.types.ts        # I{Name}Request, I{Name}Response
│   └── index.ts
├── ui/                         # (with-ui 옵션)
│   ├── {Name}View.tsx
│   └── index.ts
├── store/                      # (with-store 옵션)
│   ├── {name}.store.ts
│   └── index.ts
└── index.ts                    # barrel export
```

### Step 3: 파일 생성

#### `types/{name}.types.ts`
```typescript
export interface I{Name}Item {
  id: string;
}

export interface IGet{Name}ListRequest {
  page?: number;
  limit?: number;
}

export interface IGet{Name}ListResponse {
  items: I{Name}Item[];
  total: number;
}
```

#### `api/{name}.api.ts`
```typescript
import { apiClient } from '@shared/api';
import type { IGet{Name}ListRequest, IGet{Name}ListResponse } from '../types';

export const get{Name}List = async (
  params: IGet{Name}ListRequest,
): Promise<IGet{Name}ListResponse> => {
  const { data } = await apiClient.get('/{name}', { params });
  return data;
};
```

#### `hooks/use-{name}.ts`
```typescript
import { useQuery } from '@tanstack/react-query';
import { get{Name}List } from '../api';
import type { IGet{Name}ListRequest } from '../types';

export const use{Name}List = (params: IGet{Name}ListRequest) => {
  return useQuery({
    queryKey: ['{name}', 'list', params],
    queryFn: () => get{Name}List(params),
  });
};
```

#### `index.ts`
```typescript
export * from './types';
export * from './api';
export * from './hooks';
```

### Step 4: QA 검증
- `npm run typecheck` 실행
- FSD 레이어 의존성 규칙 확인
- barrel export 정상 여부 확인

## Agent Delegation

| Step | Agent |
|------|-------|
| 1-3 | feature-builder |
| 4 | qa-reviewer |
