import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/common/hooks/useAuth'
import Login from '@/views/Login'
import Register from '@/views/Register'
import WeatherDashboard from '@/views/WeatherDashboard'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <WeatherDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

export default AppRoutes
