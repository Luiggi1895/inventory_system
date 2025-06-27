// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import Alerts from '../components/Alerts';
import ProductsTable from '../components/ProductsTable';
import PrediccionStock from '../components/PrediccionStock';
import MovimientosTable from '../components/MovimientosTable';

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  // estado de Predicción
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [valoresPrediccion, setValoresPrediccion] = useState([]);

  // búsqueda + paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // 1) cargar productos
    api.get('/productos/')
      .then(res => setProductos(res.data))
      .catch(console.error);

    // 2) métricas / dropdown de predicción
    api.get('/dashboard/')
      .then(res => setDashboard(res.data))
      .catch(console.error);

    // 3) movimientos (solo para la tabla pequeña)
    api.get('/movimientos/')
      .then(res => {
        const ordenados = res.data
          .map(m => ({
            ...m,
            fechaStr: m.fecha_str,
            horaStr: m.hora,
            productoNombre: m.producto_nombre,
          }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setMovimientos(ordenados);
      })
      .catch(console.error);
  }, []);

  const handlePrediccion = () => {
    if (!productoSeleccionado) return;
    api.get(`/prediccion/${productoSeleccionado}/`)
      .then(res => setValoresPrediccion(res.data.valores))
      .catch(err => {
        console.error(err);
        setValoresPrediccion([]);
      });
  };

  // filtrar + paginar para ProductsTable
  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Inventario 2.0</h1>

        {dashboard && <StatsCards data={dashboard} />}
        {dashboard && (
          <Alerts
            bajoStock={dashboard.bajo_stock}
            criticos={dashboard.criticos_prediccion}
          />
        )}

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

        {dashboard && (
          <PrediccionStock
            productos={dashboard.productos}
            productoSeleccionado={productoSeleccionado}
            valores={valoresPrediccion}
            onSelect={setProductoSeleccionado}
            onBuscar={handlePrediccion}
          />
        )}

        <MovimientosTable movimientos={movimientos.slice(0, 5)} />
      </main>
    </div>
  );
}
