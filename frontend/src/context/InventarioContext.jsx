// src/context/InventarioContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import api from '../services/api';

export const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, dRes, mRes] = await Promise.all([
        api.get('/productos/'),
        api.get('/dashboard/'),
        api.get('/movimientos/'),
      ]);

      setProductos(pRes.data);
      setDashboard(dRes.data);

      const mv = mRes.data
        .map(m => ({
          ...m,
          fechaStr: m.fecha_str,
          horaStr: m.hora,
          productoNombre: m.producto_nombre,
        }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMovimientos(mv);
    } catch (err) {
      console.error('Error cargando inventario', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <InventarioContext.Provider
      value={{
        productos,
        dashboard,
        movimientos,
        loading,
        refresh: fetchAll
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
}
