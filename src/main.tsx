import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { logSiteFooterToConsole } from './lib/site'
import './index.css'

logSiteFooterToConsole()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
