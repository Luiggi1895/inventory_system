import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo_interno: ''
  });

  // Obtener productos al cargar
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/productos/', formData);
      fetchProductos(); // Refrescar lista
      setFormData({ nombre: '', descripcion: '', codigo_interno: '' }); // Limpiar form
    } catch (error) {
      console.error('Error al registrar producto:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="codigo_interno"
          placeholder="Código Interno"
          value={formData.codigo_interno}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Registrar Producto</button>
      </form>

      <h3>Lista de productos</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Código Interno</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.codigo_interno}</td>
              <td>
                {p.codigo_qr && (
                  <img src={`http://localhost:8000${p.codigo_qr}`} alt="QR" width="60" />
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
