import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Ponto de entrada da aplicação React.
 * Monta o componente App na div#root do index.html.
 * O StrictMode ativa avisos adicionais em desenvolvimento.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
