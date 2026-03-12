/*
 * ===========================================================================
 * Main Entry - Ponto de Entrada do React
 * ===========================================================================
 *
 * Inicializa a aplicação React no DOM.
 * Importa o CSS global e renderiza o componente App no elemento #root.
 * ===========================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
