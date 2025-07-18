import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
{/*import { AuthProvider } from './contexts/AuthContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastProvider from './components/ui/Toast/ToastProvider.tsx'*/}

{/*const queryClient = new QueryClient()*/}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)


{/**
  <ToastProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
    </ToastProvider>
   */}