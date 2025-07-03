import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { InventarioContext } from '../context/InventarioContext';
import api from '../services/api';

export default function Movimientos() {
  const { productos, movimientos, refresh, loading } = useContext(InventarioContext);
  const [form, setForm] = useState({
    producto: '',
    tipo: 'entrada',
    cantidad: 1,
    almacen: 'principal'
  });
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.producto) {
      setMensaje('❌ Selecciona un producto');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/movimientos/', form);
      setMensaje('✅ Movimiento registrado');
      await refresh();
      setForm({ producto: '', tipo: 'entrada', cantidad: 1, almacen: 'principal' });
    } catch {
      setMensaje('❌ Error al registrar movimiento');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando movimientos…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Movimientos</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <select
            name="producto"
            value={form.producto}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">-- Selecciona producto --</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>

          <input
            type="number"
            name="cantidad"
            min="1"
            value={form.cantidad}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="almacen"
            value={form.almacen}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="principal">Principal</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className={`col-span-2 md:col-span-1 font-semibold rounded p-2 
              ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {submitting ? 'Registrando…' : 'Registrar Movimiento'}
          </button>
        </form>

        {mensaje && <p className="text-center mb-4">{mensaje}</p>}

        <div className="overflow-auto">
          <table className="min-w-full border border-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Hora</th>
                <th className="p-2 border">Producto</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Almacén</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border">{m.fechaStr}</td>
                  <td className="p-2 border">{m.horaStr}</td>
                  <td className="p-2 border">{m.productoNombre}</td>
                  <td className="p-2 border">{m.tipo}</td>
                  <td className="p-2 border">{m.cantidad}</td>
                  <td className="p-2 border">{m.almacen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
