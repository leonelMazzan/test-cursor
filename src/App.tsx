import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/views/Login'
import Register from '@/views/Register'
import WeatherDashboard from '@/views/WeatherDashboard'
import ProtectedRoute from '@/routes/ProtectedRoute'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<WeatherDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)

export default App
