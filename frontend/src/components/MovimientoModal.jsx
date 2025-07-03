// src/components/MovimientoModal.jsx

import React from 'react';

export default function MovimientoModal({ abierto, nombre, movimientos, onCerrar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h3 className="text-lg font-bold mb-2">
          Movimientos de: {nombre}
        </h3>
        <ul className="max-h-60 overflow-y-auto space-y-1 text-sm">
          {movimientos.length > 0 ? (
            movimientos.map((m, idx) => (
              <li key={idx}>
                {m.fecha_str} — {m.hora} — {m.tipo} — {m.cantidad}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">
              No hay movimientos para este producto
            </li>
          )}
        </ul>
        <button
          onClick={onCerrar}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
