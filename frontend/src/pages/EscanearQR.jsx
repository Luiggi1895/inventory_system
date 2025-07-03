import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { QrReader } from 'react-qr-reader';
import api from '../services/api';
import { InventarioContext } from '../context/InventarioContext';

export default function EscanearQR() {
  const { refresh, loading } = useContext(InventarioContext);
  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState(null);
  const [mov, setMov] = useState({ tipo: 'entrada', cantidad: 1 });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleScan = async data => {
    if (data && data !== codigo) {
      setCodigo(data);
      try {
        const { data: res } = await api.get(`/productos/?codigo_interno=${data}`);
        setProducto(res[0] || { error: 'Producto no encontrado' });
      } catch {
        setProducto({ error: 'Error en la búsqueda' });
      }
    }
  };

  const handleError = err => {
    console.error('QR Reader error', err);
  };

  const handleMove = async e => {
    e.preventDefault();
    if (!producto?.id) return;
    setSubmitting(true);
    try {
      await api.post('/movimientos/', {
        producto: producto.id,
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        almacen: 'principal'
      });
      setMsg('✅ Movimiento registrado');
      // Refresca todo el inventario
      await refresh();
      // Y vuelve a traer sólo este producto para ver stock actualizado
      const { data: up } = await api.get(`/productos/?codigo_interno=${codigo}`);
      setProducto(up[0] || { error: 'No encontrado tras movimiento' });
    } catch {
      setMsg('❌ Error al registrar movimiento');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Escanear Código QR</h2>

        <div className="max-w-lg mx-auto mb-8">
          <QrReader
            onResult={(result, error) => {
              if (result) handleScan(result.text);
              if (error) handleError(error);
            }}
            constraints={{ facingMode: 'environment' }}
            className="w-full rounded-lg shadow"
          />
        </div>

        {producto && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
            {producto.error ? (
              <p className="text-red-600 text-center">{producto.error}</p>
            ) : (
              <>
                <p><strong>Nombre:</strong> {producto.nombre}</p>
                <p><strong>Stock actual:</strong> {producto.stock}</p>

                <form onSubmit={handleMove} className="space-y-4 mt-4">
                  <select
                    value={mov.tipo}
                    disabled={submitting}
                    onChange={e => setMov({ ...mov, tipo: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    disabled={submitting}
                    value={mov.cantidad}
                    onChange={e => setMov({ ...mov, cantidad: +e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full font-semibold rounded px-4 py-2 
                      ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    {submitting ? 'Registrando…' : 'Registrar Movimiento'}
                  </button>
                </form>
              </>
            )}
            {msg && <p className="mt-4 text-center">{msg}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
