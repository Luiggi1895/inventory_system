import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [prediccion, setPrediccion] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (productoSeleccionado) {
      fetchPrediccion(productoSeleccionado);
    }
  }, [productoSeleccionado]);

  const fetchProductos = async () => {
    const res = await axios.get('http://localhost:8000/api/productos/');
    setProductos(res.data);
  };

  const fetchDashboard = async () => {
    const res = await axios.get('http://localhost:8000/api/dashboard/');
    setDashboard(res.data);
  };

  const fetchPrediccion = async (productoId) => {
    const res = await axios.get(`http://localhost:8000/api/prediccion/${productoId}/`);
    setPrediccion(res.data);
  };

  const datosGrafico = prediccion?.valores?.map((valor, index) => ({
    name: `Día ${index + 1}`,
    valor: valor
  }));

  const nombreProducto = productos.find(p => p.id === parseInt(productoSeleccionado))?.nombre;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Predicción de demanda</h2>

      <label className="block mb-2 font-semibold">Producto:</label>
      <select
        className="border border-gray-300 p-2 rounded mb-6"
        value={productoSeleccionado}
        onChange={(e) => setProductoSeleccionado(e.target.value)}
      >
        <option value="">-- Selecciona uno --</option>
        {productos.map((prod) => (
          <option key={prod.id} value={prod.id}>
            {prod.nombre}
          </option>
        ))}
      </select>

      {prediccion?.valores && prediccion.valores.length > 0 && (
        <div className="mb-8 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">📦 Producto: {nombreProducto}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datosGrafico}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mt-8 mb-2">🔔 Alertas</h2>
        {dashboard?.bajo_stock?.map((item, i) => (
          <p key={i}>⚠️ Producto <strong>{item.nombre}</strong> con {item.stock} unidades</p>
        ))}
        {dashboard?.criticos_prediccion?.map((item, i) => (
          <p key={i}>⚠️ Predicción crítica: <strong>{item.nombre}</strong> → {item.prediccion_final} unidades</p>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">🔍 Detalle de productos en alerta</h2>
        {dashboard?.bajo_stock?.map((item, i) => (
          <div key={i} className="mb-2">
            <strong>{item.nombre}</strong><br />
            Stock: {item.stock}
          </div>
        ))}
        {dashboard?.criticos_prediccion?.map((item, i) => (
          <div key={i} className="mb-2">
            <strong>{item.nombre}</strong><br />
            Predicción: {item.prediccion_final}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
