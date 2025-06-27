// src/pages/EscanearQR.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api      from '../services/api';
import { QrReader } from 'react-qr-reader';

export default function EscanearQR() {
  const [codigo,   setCodigo]   = useState('');
  const [producto, setProducto] = useState(null);
  const [movimiento, setMovimiento] = useState({ tipo: 'entrada', cantidad: 1 });
  const [mensaje,  setMensaje]  = useState('');

  // Cuando el lector detecta algo:
  const handleScan = async (data) => {
    if (data && data !== codigo) {
      setCodigo(data);
      try {
        const { data: res } = await api.get(`/productos/?codigo_interno=${data}`);
        setProducto(res[0] || { error: 'Producto no encontrado' });
      } catch (err) {
        console.error('Error al buscar producto', err);
        setProducto({ error: 'Error en la búsqueda' });
      }
    }
  };

  const handleError = err => {
    console.error('Error en lector QR:', err);
  };

  // Enviar movimiento al backend
  const handleMovimiento = async e => {
    e.preventDefault();
    if (!producto || producto.error) return;
    try {
      await api.post('/movimientos/', {
        producto: producto.id,
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad,
      });
      setMensaje('✅ Movimiento registrado');
      setProducto(null);
      setCodigo('');
      setMovimiento({ tipo: 'entrada', cantidad: 1 });
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al registrar movimiento');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Escanear Código QR</h2>

        <div className="max-w-lg mx-auto mb-8">
          <QrReader
            onResult={(result, error) => {
              if (result) handleScan(result.text);
              if (error)  handleError(error);
            }}
            constraints={{ facingMode: 'environment' }}
            className="w-full rounded-lg shadow"
          />
        </div>

        {producto && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-lg mx-auto">
            {producto.error
              ? <p className="text-red-600 text-center">{producto.error}</p>
              : <>
                  <h3 className="text-xl font-semibold mb-2">Producto detectado:</h3>
                  <p><strong>Nombre:</strong> {producto.nombre}</p>
                  <p><strong>Stock actual:</strong> {producto.stock}</p>
                  {producto.qr && <img
                    src={ producto.qr.startsWith('http')
                      ? producto.qr
                      : `${api.defaults.baseURL}${producto.qr}` }
                    alt="QR" className="w-24 h-24 my-4" />}
                  <form onSubmit={handleMovimiento} className="space-y-4 mt-6">
                    <select
                      value={movimiento.tipo}
                      onChange={e => setMovimiento({ ...movimiento, tipo: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                    <input
                      type="number" min="1"
                      value={movimiento.cantidad}
                      onChange={e => setMovimiento({ ...movimiento, cantidad: +e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-4 py-2"
                    >
                      Registrar Movimiento
                    </button>
                  </form>
                </>
            }
            {mensaje && <p className="mt-4 text-center text-lg">{mensaje}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
