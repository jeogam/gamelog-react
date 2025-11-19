import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Sandbox from './pages/Sandbox'
import Hades from './pages/jogos/Hades'
import Btd6 from './pages/jogos/Btd6'          
import EldenRing from './pages/jogos/EldenRing' 

// Importando as novas atividades
import Atividade3 from './pages/sandbox/Atividade3'
import Atividade4 from './pages/sandbox/Atividade4'
import Atividade5 from './pages/sandbox/Atividade5'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container">
        <Routes>
          {/* Rotas existentes... */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hades" element={<Hades />} />
          <Route path="/btd6" element={<Btd6 />} />
          <Route path="/elden-ring" element={<EldenRing />} />

          {/* Rotas do Sandbox */}
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/sandbox/atividade-3" element={<Atividade3 />} />
          <Route path="/sandbox/atividade-4" element={<Atividade4 />} />
          <Route path="/sandbox/atividade-5" element={<Atividade5 />} />
        </Routes>
        
        <Footer /> 
      </div>
    </BrowserRouter>
  )
}
export default App