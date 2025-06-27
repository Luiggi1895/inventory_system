import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/dashboard/');
      setData(res.data);
    } catch (err) {
      console.error('Error al cargar dashboard', err);
    }
  };

  if (!data) return <p className="p-4">Cargando dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 Resumen General del Inventario</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border p-4 shadow rounded">
          <h3 className="font-bold text-lg">Total Productos</h3>
          <p className="text-2xl">{data.total_productos}</p>
        </div>
        <div className="border p-4 shadow rounded">
          <h3 className="font-bold text-lg">Entradas Registradas</h3>
          <p className="text-2xl text-green-600">+{data.total_entradas}</p>
        </div>
        <div className="border p-4 shadow rounded">
          <h3 className="font-bold text-lg">Salidas Registradas</h3>
          <p className="text-2xl text-red-600">-{data.total_salidas}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mt-6">⚠️ Productos con bajo stock</h3>
        <ul className="list-disc pl-5 mt-2">
          {data.bajo_stock.length === 0 ? <li>Sin alertas.</li> : data.bajo_stock.map((p, i) => (
            <li key={i}>{p.nombre} – {p.stock} unidades</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold mt-6">🧠 Productos críticos según predicción</h3>
        <ul className="list-disc pl-5 mt-2">
          {data.criticos_prediccion.length === 0 ? <li>No hay predicciones críticas.</li> : data.criticos_prediccion.map((p, i) => (
            <li key={i}>{p.nombre} – predicción: {p.prediccion_final.toFixed(2)} unidades</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
