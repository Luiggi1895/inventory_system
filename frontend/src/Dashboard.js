import React from 'react';
import './Dashboard.css';

const Dashboard = ({ resumen }) => {
  return (
    <div className="dashboard">
      <h2>Resumen del Inventario</h2>
      <div className="cards">
        <div className="card">
          <h3>Total de Productos</h3>
          <p>{resumen.totalProductos}</p>
        </div>
        <div className="card">
          <h3>Total de Entradas</h3>
          <p>{resumen.totalEntradas}</p>
        </div>
        <div className="card">
          <h3>Total de Salidas</h3>
          <p>{resumen.totalSalidas}</p>
        </div>
        <div className="card alert">
          <h3>Alertas Activas</h3>
          <p>{resumen.alertas}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
