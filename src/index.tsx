import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

// Код для обработки перенаправления с 404.html
(function() {
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    
    // В публичном URL будет '/lubit_ne_lubit'
    const publicUrl = '/lubit_ne_lubit';
    
    // Определяем, нужно ли добавить publicUrl к пути
    const path = redirect.startsWith(publicUrl) 
      ? redirect 
      : publicUrl + redirect;
      
    window.history.replaceState(null, '', path);
  }
})();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
); 