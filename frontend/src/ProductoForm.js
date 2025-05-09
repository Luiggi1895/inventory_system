// src/ProductoForm.js
import React, { useState } from 'react';

function ProductoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setMensaje('✅ Producto registrado correctamente.');
      setFormData({ nombre: '', descripcion: '', codigo: '' });
    } else {
      setMensaje('❌ Error al registrar producto.');
    }
  };

  return (
    <div>
      <h2>Registrar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Descripción:</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

        <label>Código:</label>
        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />

        <button type="submit">Registrar</button>
      </form>
      <p>{mensaje}</p>
    </div>
  );
}

export default ProductoForm;
