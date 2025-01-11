import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import AuthGuard from './contexts/AuthGuard.jsx';
import { ClientProvider } from './lib/providers/clientProvider.jsx'
import StoreProvider from './lib/providers/StoreProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <AuthGuard>
          <ClientProvider>
            <App />
          </ClientProvider>
        </AuthGuard>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
