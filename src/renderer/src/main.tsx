import './assets/main.css'

import "@fontsource/inter"; // Standart sans-serif
import "@fontsource/inter/600.css"; 
import "@fontsource/jetbrains-mono"; // Kodlar üçün

import "@fontsource/nunito/index.css";
import "@fontsource/nunito/700.css"; // Qalın versiya üçün

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
