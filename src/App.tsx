import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { Router } from './Router'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer style={{ fontSize: '1rem' }} />
    </BrowserRouter>
  )
}

export default App
