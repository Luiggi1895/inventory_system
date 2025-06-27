// src/components/PrediccionStock.jsx

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function PrediccionStock({
  productos,
  productoSeleccionado,
  valores,
  onSelect,
  onBuscar
}) {
  const data = (valores || []).map((v, i) => ({
    name: `Día ${i + 1}`,
    valor: v,
  }));

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Predicción de Stock</h2>

      <div className="flex items-center space-x-3 mb-4">
        <select
          className="border border-gray-300 p-2 rounded w-full sm:w-64"
          value={productoSeleccionado}
          onChange={e => onSelect(e.target.value)}
        >
          <option value="">-- Selecciona un producto --</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>
              {prod.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={onBuscar}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="border border-dashed border-gray-300 rounded h-48 flex items-center justify-center text-gray-400">
          Selecciona un producto y haz clic en “Buscar”
        </div>
      )}
    </div>
  );
}
