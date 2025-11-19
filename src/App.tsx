import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Sandbox from './pages/Sandbox'
import Hades from './pages/Hades' 

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sandbox" element={<Sandbox />} />
          
          {/* 2. Adicione a rota aqui */}
          <Route path="/hades" element={<Hades />} /> 
        </Routes>
        
        <Footer /> 
      </div>
    </BrowserRouter>
  )
}

export default App