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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <div>
          Página {currentPage} / {totalPages}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="ml-2 px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-1 px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>

      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Categoría</th>
            <th className="p-2 border">Proveedor</th>
            <th className="p-2 border">Almacén</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-2 border">{p.nombre}</td>
              <td className="p-2 border">{p.stock}</td>
              <td className="p-2 border">{p.categoria}</td>
              <td className="p-2 border">{p.proveedor}</td>
              <td className="p-2 border">{p.almacen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
}
