import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
document.documentElement.classList.toggle("dark", shouldUseDark);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    
  </StrictMode>,
)
