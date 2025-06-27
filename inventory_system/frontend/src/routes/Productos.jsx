import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_interno: ''
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
      await axios.post('http://localhost:8000/api/productos/', formData);
      setFormData({ nombre: '', descripcion: '', codigo_interno: '' });
      fetchProductos();
    } catch (error) {
      console.error('Error al registrar producto:', error);
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
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="codigo_interno" placeholder="Código Interno" value={formData.codigo_interno} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Registrar</button>
      </form>

      <h2 className="text-xl font-bold mb-4">Productos Registrados</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Código Interno</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Código QR</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td className="border p-2">{prod.nombre}</td>
              <td className="border p-2">{prod.descripcion}</td>
              <td className="border p-2">{prod.codigo_interno}</td>
              <td className="border p-2">{prod.stock}</td>
              <td className="border p-2">
                {prod.qr && <img src={`http://localhost:8000${prod.qr}`} alt="QR" width="80" />}
              </td>
              <td className="border p-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => predecirStock(prod.id)}
                >
                  🧠 Predecir stock
                </button>
                {predicciones[prod.id] && predicciones[prod.id].valores && (
                  <div className="mt-2 text-sm">
                    <strong>Próximos 5 días:</strong>
                    <ul>
                      {predicciones[prod.id].valores.map((val, i) => (
                        <li key={i}>Día {i + 1}: {val.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {predicciones[prod.id]?.error && (
                  <p className="text-red-600 text-sm">{predicciones[prod.id].error}</p>
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
