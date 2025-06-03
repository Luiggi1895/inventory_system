import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'; // ✅ Aquí importamos el App real

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
