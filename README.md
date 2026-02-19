# React Auth + Weather Dashboard

Una aplicación React con autenticación local y dashboard de clima en tiempo real.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS v3** + **Shadcn/ui** — estilos y componentes UI
- **React Router DOM v7** — enrutamiento con ruta protegida
- **Dexie.js** — persistencia de usuarios en IndexedDB
- **Zustand** — estado global de sesión (persiste en `localStorage`)
- **OpenWeatherMap API** — clima por coordenadas y por ciudad
- **React Compiler** — memoización automática (no se usa `useMemo`/`useCallback` manualmente)

## Funcionalidades

- **Registro** de usuario con email y contraseña (mínimo 6 caracteres)
- **Login** con validación contra IndexedDB
- **Ruta protegida** `/dashboard`: redirige a `/login` si no hay sesión activa
- **Geolocalización automática** al entrar al dashboard
- **Fallback por ciudad**: si se deniega la ubicación, se puede buscar por nombre de ciudad
- **Tarjeta de clima**: temperatura, descripción, humedad, viento, presión y visibilidad

## Estructura

```
src/
  common/
    db/           # Dexie: base de datos AppDB con tabla users
    hooks/        # useAuth (Zustand store con persist)
    lib/          # cn() utility
    types/        # User, AuthUser, WeatherData, etc.
  components/ui/  # Button, Input, Label, Card (Shadcn-style)
  features/
    auth/         # LoginForm, RegisterForm, authService
    weather/      # WeatherCard, weatherService
  views/          # Login, Register, WeatherDashboard
  routes/         # AppRoutes + ProtectedRoute
  App.tsx
  main.tsx
```

## Setup

### 1. Clonar e instalar

```bash
pnpm install
```

### 2. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_OPEN_WEATHER_API_KEY=tu_api_key_aqui
```

> Obtené tu API key gratuita en [openweathermap.org](https://openweathermap.org/api). **No subas el `.env` al repositorio.**

### 3. Levantar el servidor de desarrollo

```bash
pnpm dev
```

La app estará disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build |
| `pnpm lint` | Linting con ESLint |

## Notas

- Las contraseñas se almacenan en texto plano en IndexedDB. Esto es válido para una demo local; en producción se requiere hashing en el servidor.
- La sesión persiste en `localStorage` mediante Zustand persist. Al cerrar sesión se limpia el estado.
