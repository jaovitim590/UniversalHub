import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HubPage } from './pages/hub'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HubPage />
  </StrictMode>,
)
