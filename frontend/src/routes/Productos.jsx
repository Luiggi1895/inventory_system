import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_interno: '',
    categoria: '',
    proveedor: '',
    fecha_vencimiento: ''
  });
  const [predicciones, setPredicciones] = useState({});

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/productos/');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:8000/api/productos/${editandoId}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/productos/', formData);
      }
      setFormData({
        nombre: '',
        descripcion: '',
        codigo_interno: '',
        categoria: '',
        proveedor: '',
        fecha_vencimiento: ''
      });
      setEditandoId(null);
      fetchProductos();
    } catch (error) {
      console.error('Error al registrar/editar producto:', error);
    }
  };

  const predecirStock = async (productoId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/prediccion/${productoId}/`);
      setPredicciones(prev => ({ ...prev, [productoId]: res.data }));
    } catch (error) {
      setPredicciones(prev => ({ ...prev, [productoId]: { error: 'No se pudo predecir.' } }));
      console.error('Error al predecir stock:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registrar Producto</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="border p-2" required />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="border p-2" required />
        <input type="text" name="codigo_interno" placeholder="Código Interno" value={formData.codigo_interno} onChange={handleChange} className="border p-2" required />
        <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} className="border p-2" />
        <input type="text" name="categoria" placeholder="Categoría" value={formData.categoria} onChange={handleChange} className="border p-2" />
        <input type="text" name="proveedor" placeholder="Proveedor" value={formData.proveedor} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2">
          {editandoId ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Productos Registrados</h2>
      <table className="min-w-full border border-gray-300 shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Descripción</th>
            <th className="p-3 border">Código Interno</th>
            <th className="p-3 border">Stock</th>
            <th className="p-3 border">Categoría</th>
            <th className="p-3 border">Proveedor</th>
            <th className="p-3 border">Vencimiento</th>
            <th className="p-3 border">Código QR</th>
            <th className="p-3 border">Acciones</th>

          </tr>
        </thead>
        <tbody>
          {productos.map((prod, index) => (
            <tr key={prod.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="p-2 border text-center">{prod.nombre}</td>
            <td className="p-2 border text-center">{prod.descripcion}</td>
            <td className="p-2 border text-center">{prod.codigo_interno}</td>
            <td className="p-2 border text-center">{prod.stock}</td>
            <td className="p-2 border text-center">{prod.categoria}</td>
            <td className="p-2 border text-center">{prod.proveedor}</td>
            <td className="p-2 border text-center">{prod.fecha_vencimiento}</td>
            <td className="p-2 border text-center">
    {prod.qr && <img src={prod.qr.startsWith('http') ? prod.qr : `http://localhost:8000${prod.qr}`} alt="QR" width="80" />}
  </td>
  <td className="p-2 border text-center">
    {/* botones predecir / editar */}
  </td>
              <td className="p-2 border text-center space-y-1">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded w-full"
                  onClick={() => predecirStock(prod.id)}
                >
                  🧠 Predecir
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded w-full"
                  onClick={() => {
                    setEditandoId(prod.id);
                    setFormData({
                      nombre: prod.nombre,
                      descripcion: prod.descripcion,
                      codigo_interno: prod.codigo_interno,
                      categoria: prod.categoria || '',
                      proveedor: prod.proveedor || '',
                      fecha_vencimiento: prod.fecha_vencimiento || ''
                    });
                  }}
                >
                  ✏️ Editar
                </button>
                {predicciones[prod.id]?.valores && (
                  <div className="mt-1 text-xs text-left">
                    <strong>Próximos 5 días:</strong>
                    <ul className="list-disc pl-4">
                      {predicciones[prod.id].valores.map((val, i) => (
                        <li key={i}>Día {i + 1}: {val.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {predicciones[prod.id]?.error && (
                  <p className="text-red-500 text-xs">{predicciones[prod.id].error}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
