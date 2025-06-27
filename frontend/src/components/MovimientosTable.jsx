import React from 'react';

export default function MovimientosTable({ movimientos }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Historial de Movimientos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Fecha','Hora','Producto','Tipo','Cant.','Almacén'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">{movimientos.length > 0
            ? movimientos.map(m => (
                <tr key={m.id}>
                  <td className="px-4 py-2 text-center">{m.fecha_str}</td>
                  <td className="px-4 py-2 text-center">{m.hora}</td>
                  <td className="px-4 py-2 text-center">{m.producto_nombre}</td>
                  <td className="px-4 py-2 text-center">{m.tipo}</td>
                  <td className="px-4 py-2 text-center">{m.cantidad}</td>
                  <td className="px-4 py-2 text-center">{m.almacen}</td>
                </tr>
              ))
            : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No hay movimientos
                  </td>
                </tr>
              )}</tbody>
        </table>
      </div>
    </div>
  );
}