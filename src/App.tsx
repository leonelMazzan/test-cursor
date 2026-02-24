import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes'
import ThemeProvider from '@/common/providers/ThemeProvider'

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
)

export default App
