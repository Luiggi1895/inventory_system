import React from 'react';

export default function Alerts({ bajoStock, criticos }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">🔔 Alertas</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Bajo stock</h3>
        {bajoStock.length > 0 ? (
          bajoStock.map((item, i) => (
            <p key={i} className="text-yellow-600">
              ⚠️ <strong>{item.nombre}</strong>: {item.stock} unidades
            </p>
          ))
        ) : (
          <p className="text-green-600">✔️ No hay productos con stock bajo</p>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Predicción crítica</h3>
        {criticos.length > 0 ? (
          criticos.map((item, i) => (
            <p key={i} className="text-red-600">
              ⚠️ <strong>{item.nombre}</strong>: se estiman {item.prediccion_final} unidades
            </p>
          ))
        ) : (
          <p className="text-green-600">✔️ No hay predicciones críticas</p>
        )}
      </div>
    </div>
  );
}