import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Sandbox from './pages/Sandbox'
import Hades from './pages/Hades'
import Btd6 from './pages/Btd6'          // <--- Novo
import EldenRing from './pages/EldenRing' // <--- Novo

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
          
          <Route path="/hades" element={<Hades />} />
          <Route path="/btd6" element={<Btd6 />} />           
          <Route path="/elden-ring" element={<EldenRing />} /> 
        </Routes>
        
        <Footer /> 
      </div>
    </BrowserRouter>
  )
}

export default App