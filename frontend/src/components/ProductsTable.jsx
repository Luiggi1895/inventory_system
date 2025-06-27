import React from 'react';

export default function ProductsTable({
  products,
  searchTerm,
  onSearch,
  currentPage,
  totalPages,
  onPageChange
}) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Productos</h2>
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          className="border p-2 rounded w-full sm:w-1/3"
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mb-4">
          <thead className="bg-gray-50">
            <tr>
              {['Nombre','Stock','Categoría','Acciones'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">{
            products.length > 0
              ? products.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.categoria}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Editar
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No hay productos
                  </td>
                </tr>
              )
          }</tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
