import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importando a Navbar
import Navbar from './components/Navbar'

// Páginas
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Sandbox from './pages/Sandbox'

function App() {
  return (
    <BrowserRouter>
      {/* A Navbar fica FORA do Routes para aparecer sempre */}
      <Navbar />

      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App