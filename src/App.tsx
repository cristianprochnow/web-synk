import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/Auth'
import { Router } from './Router'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
      <ToastContainer style={{ fontSize: '1rem' }} />
    </BrowserRouter>
  )
}

export default App
