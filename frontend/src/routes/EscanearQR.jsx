import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const EscanearQR = () => {
  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState(null);
  const [movimiento, setMovimiento] = useState({ tipo: 'entrada', cantidad: 1 });
  const [mensaje, setMensaje] = useState('');

  const handleScan = async (data) => {
    if (data && data !== codigo) {
      setCodigo(data);
      try {
        const res = await axios.get(`http://localhost:8000/api/productos/?codigo_interno=${data}`);
        if (res.data.length > 0) {
          setProducto(res.data[0]);
        } else {
          setProducto({ error: "Producto no encontrado" });
        }
      } catch (err) {
        console.error("Error al buscar producto", err);
      }
    }
  };

  const handleMovimiento = async (e) => {
    e.preventDefault();
    if (!producto || producto.error) return;

    try {
      await axios.post('http://localhost:8000/api/movimientos/', {
        producto: producto.id,
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad
      });
      setMensaje('✅ Movimiento registrado correctamente');
      setProducto(null);
      setCodigo('');
    } catch (error) {
      setMensaje('❌ Error al registrar el movimiento');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Escanear Código QR</h2>
      <div className="mb-4">
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result?.text);
            }
          }}
          constraints={{ facingMode: 'environment' }}
          style={{ width: '100%' }}
        />
      </div>

      {producto && (
        <div className="mt-4">
          {producto.error ? (
            <p className="text-red-600">{producto.error}</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">Producto detectado:</h3>
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Stock actual:</strong> {producto.stock}</p>
              <img src={`http://localhost:8000${producto.qr}`} alt="QR" width="100" />

              <form onSubmit={handleMovimiento} className="mt-4 space-y-2">
                <select value={movimiento.tipo} onChange={(e) => setMovimiento({ ...movimiento, tipo: e.target.value })}>
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
                <input
                  type="number"
                  min="1"
                  value={movimiento.cantidad}
                  onChange={(e) => setMovimiento({ ...movimiento, cantidad: parseInt(e.target.value) })}
                  className="border p-1"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2">Registrar Movimiento</button>
              </form>
            </div>
          )}
        </div>
      )}

      {mensaje && <p className="mt-2 font-bold">{mensaje}</p>}
    </div>
  );
};

export default EscanearQR;
