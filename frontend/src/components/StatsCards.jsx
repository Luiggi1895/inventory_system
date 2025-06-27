import React from 'react';

export default function StatsCards({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total de Productos" value={data.total_productos} />
      <StatCard label="Total de Entradas" value={data.total_entradas} color="green" />
      <StatCard label="Total de Salidas" value={data.total_salidas} color="red" />
      <StatCard label="Alertas Activas" value={data.criticos_prediccion.length} color="red" bg="bg-red-50" />
    </div>
  );
}

function StatCard({ label, value, color = 'gray', bg = 'bg-white' }) {
  const textColor = {
    gray: 'text-gray-800',
    green: 'text-green-500',
    red: 'text-red-500',
  }[color];

  return (
    <div className={`${bg} rounded-2xl shadow p-6 text-center`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${textColor}`}>{value}</p>
    </div>
  );
}