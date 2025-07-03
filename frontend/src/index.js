// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { InventarioProvider } from './context/InventarioContext';

ReactDOM.render(
  <React.StrictMode>
    <InventarioProvider>
      <App />
    </InventarioProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
