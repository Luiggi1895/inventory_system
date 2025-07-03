// src/pages/Dashboard.jsx
import React, { useContext, useState } from 'react';
import { InventarioContext } from '../context/InventarioContext';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import Alerts from '../components/Alerts';
import ProductsTable from '../components/ProductsTable';
import PrediccionStock from '../components/PrediccionStock';
import MovimientosTable from '../components/MovimientosTable';
import api from '../services/api';

export default function Dashboard() {
  const { productos, dashboard, movimientos, loading } = useContext(InventarioContext);

  // Estado local de predicción
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [valoresPrediccion, setValoresPrediccion] = useState([]);

  // Búsqueda + paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar y paginar
  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrediccion = () => {
    if (!productoSeleccionado) return;
    api.get(`/prediccion/${productoSeleccionado}/`)
      .then(res => setValoresPrediccion(res.data.valores))
      .catch(() => setValoresPrediccion([]));
  };

  // Mientras carga, no renderices el dashboard
  if (loading || !dashboard) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-xl">Cargando inventario…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Inventario 2.0</h1>

        <StatsCards data={dashboard} />
        <Alerts
          bajoStock={dashboard.bajo_stock}
          criticos={dashboard.criticos_prediccion}
        />

        <ProductsTable
          products={currentProducts}
          searchTerm={searchTerm}
          onSearch={term => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <PrediccionStock
          productos={dashboard.productos}
          productoSeleccionado={productoSeleccionado}
          valores={valoresPrediccion}
          onSelect={setProductoSeleccionado}
          onBuscar={handlePrediccion}
        />

        <MovimientosTable movimientos={movimientos.slice(0, 5)} />
      </main>
    </div>
  );
}
