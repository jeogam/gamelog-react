import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// 1. Importar o CSS do Bootstrap (instalado via npm)
import 'bootstrap/dist/css/bootstrap.min.css'

// 2. Importar o JS do Bootstrap (para o menu mobile e modais funcionarem)
// @ts-ignore
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 3. Importar o teu CSS personalizado (o caminho deve bater com a pasta que criamos)
import './assets/css/style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)