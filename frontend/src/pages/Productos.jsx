import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovimientoModal from '../components/MovimientoModal';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_interno: '',
    categoria: '',
    proveedor: '',
    fecha_vencimiento: '',
    almacen: 'principal',
  });
  const [predicciones, setPredicciones] = useState({});
  const [modalMov, setModalMov] = useState({
    abierto: false,
    nombre: '',
    movimientos: [],
  });

  // Carga inicial
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const { data } = await api.get('/productos/');
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos', err);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}/`, formData);
      } else {
        await api.post('/productos/', formData);
      }
      setEditandoId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        codigo_interno: '',
        categoria: '',
        proveedor: '',
        fecha_vencimiento: '',
        almacen: 'principal',
      });
      fetchProductos();
    } catch (err) {
      console.error('Error al guardar producto', err);
    }
  };

  const predecirStock = async id => {
    try {
      const res = await api.get(`/prediccion/${id}/`);
      setPredicciones(prev => ({ ...prev, [id]: res.data.valores }));
    } catch (err) {
      console.error('Error al predecir', err);
      setPredicciones(prev => ({ ...prev, [id]: [] }));
    }
  };

  const verMovimientos = async (id, nombre) => {
    try {
      const { data } = await api.get(`/movimientos/?producto=${id}`);
      setModalMov({ abierto: true, nombre, movimientos: data });
    } catch (err) {
      console.error('Error al cargar movimientos', err);
    }
  };

  return (
    <div className="p-4">
      {/* ====== Formulario ====== */}
      <h2 className="text-xl font-bold mb-4">Registrar / Editar Producto</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        <input
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="codigo_interno"
          placeholder="Código interno"
          value={formData.codigo_interno}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="categoria"
          placeholder="Categoría"
          value={formData.categoria}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="proveedor"
          placeholder="Proveedor"
          value={formData.proveedor}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="date"
          name="fecha_vencimiento"
          value={formData.fecha_vencimiento}
          onChange={handleChange}
          className="border p-2"
        />
        <select
          name="almacen"
          value={formData.almacen}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="principal">Principal</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 col-span-2 md:col-span-1"
        >
          {editandoId ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      {/* ====== Tabla de productos ====== */}
      <h2 className="text-xl font-bold mb-4">Productos Registrados</h2>
      <table className="min-w-full border border-gray-300 shadow-sm mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Stock</th>
            <th className="p-3 border">Categoría</th>
            <th className="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod, i) => (
            <tr key={prod.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-2 border">{prod.nombre}</td>
              <td className="p-2 border">{prod.stock}</td>
              <td className="p-2 border">{prod.categoria}</td>
              <td className="p-2 border space-y-1">
                {/* 🧠 Predecir */}
                <button
                  onClick={() => predecirStock(prod.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded w-full"
                >
                  🧠 Predecir
                </button>

                {/* ✏️ Editar */}
                <button
                  onClick={() => {
                    setEditandoId(prod.id);
                    setFormData({
                      nombre: prod.nombre,
                      descripcion: prod.descripcion || '',
                      codigo_interno: prod.codigo_interno,
                      categoria: prod.categoria || '',
                      proveedor: prod.proveedor || '',
                      fecha_vencimiento: prod.fecha_vencimiento || '',
                      almacen: prod.almacen || 'principal',
                    });
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded w-full"
                >
                  ✏️ Editar
                </button>

                {/* 🗑️ Eliminar */}
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar "${prod.nombre}"?`)) {
                      api.delete(`/productos/${prod.id}/`).then(fetchProductos);
                    }
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded w-full"
                >
                  🗑️ Eliminar
                </button>

                {/* 📅 Movimientos */}
                <button
                  onClick={() => verMovimientos(prod.id, prod.nombre)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded w-full"
                >
                  📅 Movimientos
                </button>

                {/* Mostrar la predicción sólo para este producto */}
                {predicciones[prod.id] && (
                  <div className="mt-2 text-sm text-left bg-gray-50 p-2 rounded">
                    <strong>Próximos días:</strong>
                    <ul className="list-disc ml-4">
                      {predicciones[prod.id].map((v, idx) => (
                        <li key={idx}>
                          Día {idx + 1}: {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ====== Modal de Movimientos ====== */}
      <MovimientoModal
        abierto={modalMov.abierto}
        nombre={modalMov.nombre}
        movimientos={modalMov.movimientos}
        onCerrar={() => setModalMov({ abierto: false, nombre: '', movimientos: [] })}
      />
    </div>
);
}