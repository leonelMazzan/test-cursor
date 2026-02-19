# Weather Dashboard

Aplicación React con autenticación local y dashboard de clima en tiempo real. Construida con Vite + React 19 + TypeScript.

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 + React Compiler |
| Estilos | Tailwind CSS v4 + Shadcn/ui |
| Routing | React Router DOM v7 |
| Estado global | Zustand v5 (con persistencia) |
| Base de datos local | Dexie.js v4 (IndexedDB) |
| Clima | OpenWeatherMap API |
| Iconos | Lucide React |

---

## Requisitos

- Node.js >= 18
- pnpm >= 8

---

## Instalación y uso

```bash
# Instalar dependencias
pnpm install

# Configurar variable de entorno (ver sección abajo)
cp .env.example .env

# Iniciar servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Lint
pnpm lint
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_OPEN_WEATHER_API_KEY=tu_api_key_aqui
```

> **Importante:** El prefijo `VITE_` es obligatorio para que Vite exponga la variable al cliente. Nunca subas el `.env` con tu clave al repositorio.

Podés obtener una API key gratuita en [openweathermap.org](https://openweathermap.org/api).

---

## Flujo de la aplicación

```
/register  ──→  IndexedDB (Dexie)  ──→  /dashboard
/login     ──→  IndexedDB (Dexie)  ──→  /dashboard
/*         ──→  (sin sesión)       ──→  /login
```

### Autenticación

- **Registro:** crea usuario en IndexedDB con email único y contraseña (mínimo 6 caracteres). Inicia sesión automáticamente al registrarse.
- **Login:** valida credenciales contra IndexedDB. La sesión se persiste en `localStorage` via Zustand.
- **Logout:** limpia el estado y redirige a `/login`.
- **Rutas protegidas:** `/dashboard` redirige a `/login` si no hay sesión activa.

### Dashboard de clima

1. Al montar, solicita permiso de **geolocalización**.
2. Si se concede → consulta clima por coordenadas (`/data/2.5/weather?lat&lon`).
3. Si se deniega → muestra input para buscar por nombre de ciudad (usa Geocoding API → Current Weather API).
4. Muestra: ciudad, descripción, icono, temperatura, sensación térmica, humedad, viento y visibilidad.
5. Estados: skeleton durante la carga, mensaje de error si la API falla.

---

## Estructura de carpetas

```
src/
├── common/
│   ├── db/           # Dexie: definición de base de datos y tabla users
│   ├── hooks/        # Hooks compartidos
│   ├── layouts/      # Layouts reutilizables
│   ├── lib/          # Utilidades (cn, etc.)
│   ├── stores/       # Zustand stores (authStore)
│   └── types/        # Tipos TypeScript (User, Weather, etc.)
├── components/
│   └── ui/           # Componentes Shadcn/ui generados
├── features/
│   ├── auth/         # LoginForm, RegisterForm
│   └── weather/      # useWeather hook
├── routes/
│   └── ProtectedRoute.tsx
├── views/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── WeatherDashboard.tsx
├── App.tsx
└── main.tsx
```

---

## Decisiones de diseño

- **Sin backend:** los usuarios se almacenan en IndexedDB del navegador. Es una demo local; no apto para producción.
- **Contraseñas en texto plano:** al ser un proyecto de demostración sin backend, las contraseñas no se hashean. En producción se usaría bcrypt o similar del lado del servidor.
- **React Compiler activo:** no se usan `useMemo`, `useCallback` ni `React.memo` — el compilador los maneja automáticamente.
- **Tailwind v4:** configuración via `@theme inline` en `index.css`, sin `tailwind.config.js`.
