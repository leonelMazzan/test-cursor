# CLAUDE.md — interview-test (Frontend React)

You are working on **frontend-interview**, a **frontend-only** React project. This file defines how you should behave when editing or creating code in this repo. All instructions here apply to the React app (e.g. `frontend-interview/`). **Infra/DevOps** (CI, deployments, AWS, etc.) is out of scope unless the user explicitly asks for it; in that case, follow the **devops-guidelines** docs.

---

## 1. Tech stack & environment

- **React** + **TypeScript** + **Vite**
- Prefer **PNPM** for package management (use `pnpm` in commands and docs)
- If Shadcn is installed, use it; if a component is missing, suggest: `pnpm dlx shadcn@latest add <component>`
- All code, comments, variable names, and documentation in **English**

---

## 2. Code quality

### TypeScript

- Use TypeScript for all components; avoid `any` (enable `noImplicitAny` in `tsconfig.json`)
- If `any` is unavoidable, add: `// ai-disable-next-line no-use-any` and a short reason
- Define types/interfaces in the same file as the component when possible

### Functions

- Keep functions short (&lt; 30 instructions), single responsibility
- Use **early returns** and guard clauses
- Prefer **const** arrow functions over `function` declarations
- Event handlers: use **handle** prefix (`handleClick`, `handleKeyDown`, `handleSubmit`)
- State updates: use functional form  
  `setCounter(prev => prev + 1)`  
  not  
  `setCounter(counter + 1)`

### Naming

- Descriptive names: `isLoading` not `loading`, `userList` not `users`, `modalRef` for refs, `handleSubmit` for submit handlers

### Security

- No hardcoded secrets; use env vars (e.g. `.env`) and keep them out of git
- Validate external inputs and API responses

---

## 3. Component design

- **Single responsibility** per component
- Prefer **functional components + hooks**
- Keep components under ~1500 lines (split when larger)
- **Composition over prop drilling**: accept `children` or slots instead of passing many props down
- **Memoization**: This project uses **React Compiler** (React 19 + `babel-plugin-react-compiler`). The compiler auto-memoizes components and values, so **do not** add `useMemo`, `useCallback`, or `React.memo` unless profiling shows a real need.
- Use **Zustand** for global state; React Context or local state for feature/local state
- Form and UI state: keep local when possible

### Props

- Define an interface next to the component and destructure in the signature:

```ts
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: ReactNode;
}
const Button = ({ variant, onClick, children }: ButtonProps) => (...)
```

---

## 4. Data & API

- **TanStack React Query** as primary for server state and caching
- Axios for simple HTTP with interceptors (e.g. auth header, 401 redirect)
- Centralize cache via QueryClient; use invalidation and optimistic updates where appropriate
- Example pattern: custom hooks that wrap `useQuery`/`useMutation` with typed `queryKey` and `queryFn`

---

## 5. Styling

- **TailwindCSS** + **Shadcn/ui**: Tailwind for utilities; Shadcn for primitives (Button, Card, Dialog, etc.). Use Shadcn components instead of building from scratch; if one is missing, add it with `pnpm dlx shadcn@latest add <component>`.
- Prefer Tailwind classes; avoid custom CSS unless necessary
- Prefer **class:** (or similar conditional-class helpers) over long ternaries in `className`
- **Mobile-first** responsive design
- Use CSS variables for theming when needed (Shadcn uses them for theming)

---

## 6. File & folder structure

Follow a **modular / feature-based** layout under `src/`:

- **`/common`** — shared: components, hooks, layouts, lib, providers, services, stores, types, utils
- **`/features`** — feature-specific modules (each can have its own components, hooks, services, types, etc.)
- **`/views`** — page-level components; compose UI from common + feature components; handle page-level state
- **`/routes`** — router config; routes import views from `/views`
- **`App.tsx`**, **`main.tsx`** at `src` root

Rules:

- Abstract third-party services behind interfaces
- Keep components small and reusable
- Views = composition and layout; avoid heavy business logic in views
- Group by **feature**, not by type

---

## 7. Testing (Vitest + React Testing Library)

- Use **Vitest** with **React Testing Library** and **user-event**
- Tests next to code: `Component.test.tsx`
- Test **behavior and user flows**, not implementation details
- AAA: Arrange, Act, Assert
- 100% coverage for utils/helpers; core component behavior must be covered
- Avoid circular mocking: mock dependencies, not the exact output you assert on
- Use `describe`/`it` with clear names: “should [expected behavior]”

---

## 8. Accessibility & UX

- Keyboard navigation for all interactive elements
- Semantic HTML and ARIA where needed (e.g. `aria-label` on icon buttons, `role="button"` + `tabIndex={0}` for div buttons)
- Color contrast ≥ 4.5:1
- Loading: skeletons for async content; optimistic updates and error boundaries where appropriate

---

## 9. Performance

- **React Compiler** handles most memoization; avoid adding `useMemo`/`useCallback`/`React.memo` by default. Optimize manually only when profiling shows a bottleneck.
- Virtualize long lists
- Lazy-load non-critical assets; use `loading="lazy"` and proper `srcSet`/`sizes` for images

---

## 10. DRY & SOLID

- **DRY**: Extract repeated logic into custom hooks, shared components, or utils
- **SRP**: One clear responsibility per function/component
- **OCP**: Prefer composition (e.g. a generic `Form` + external `Button`) over baking everything into one component

---

## 11. Documentation

- JSDoc for non-obvious or reusable components/hooks (e.g. `@component`, `@description`, `@prop`)
- Prefer clear naming over comments when possible

---

## 12. Delivering work

- Implement fully; no TODOs or placeholders unless explicitly agreed
- Include all needed imports and fix lint/TypeScript errors
- If something is ambiguous or not doable, say so instead of guessing

---

## Infra / DevOps (only when asked)

If the user asks to set up or change **infrastructure** (CI, deployments, AWS, Supabase, etc.), follow the **devops-guidelines** documentation. This CLAUDE.md remains focused on **frontend React** only.

---

# Comandos de Flujo de Trabajo (Git Flow)

## Generar PR Automático
Cuando el usuario pida "subir cambios", "crear PR" o "finalizar ticket", DEBES ejecutar el script `scripts/git-flow.sh`.

**Instrucción Clave para la Descripción:**
El argumento `<DESCRIPCION>` NO debe ser solo lo que el usuario dictó. DEBES generar un resumen técnico breve (1 linea) combinando:
1. La intención del usuario (si la dijo).
2. **TU análisis del contexto:** ¿Qué archivos se modificaron? ¿Qué hace el código nuevo?
3. Si es un `fix`, menciona qué se arregló. Si es `feat`, menciona la funcionalidad.

**Nombre de la rama (importante):**
El 5º argumento es un **slug corto y descriptivo** para la rama (en inglés, minúsculas, guiones). Así la rama queda tipo `feat/TICKET-auth-weather-dashboard` en lugar de un número o timestamp. Genera el slug a partir del trabajo realizado (ej.: auth login, weather dashboard, fix password validation).

**Sintaxis del comando:**
`./scripts/git-flow.sh <TIPO> <TICKET> <BASE> "<DESCRIPCION_GENERADA>" "<SLUG_RAMA>"`

**Ejemplos de Comportamiento:**
- User: "Sube esto, ticket Test-1" (implementaste auth + weather dashboard) →
  `./scripts/git-flow.sh feat Test-1 dev "Auth with login/register and weather dashboard with geolocation" "auth-weather-dashboard"`
- User: "Sube cambios, ticket 123" (cambiaste lógica de auth) →
  `./scripts/git-flow.sh feat 123 dev "Implementación de Guards y refactor de JWT strategy" "auth-guards-jwt"`
- User: "Arreglado el bug del login, ticket 55" →
  `./scripts/git-flow.sh fix 55 dev "Corrección de validación de contraseña en AuthService" "login-password-validation"`
- Si no pasas el 5º argumento, el script usará fecha legible (ej. `feat/123-20260219-1430`) en lugar de timestamp.