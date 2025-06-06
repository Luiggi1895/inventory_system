import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Movimientos = () => {
  const [productos, setProductos] = useState([]);
  const [movimiento, setMovimiento] = useState({
    producto: '',
    tipo: 'entrada',
    cantidad: 1
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  const handleChange = e => {
    setMovimiento({ ...movimiento, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const data = {
      ...movimiento,
      producto: parseInt(movimiento.producto),  // <--- Forzamos número
    };

    await axios.post('http://localhost:8000/api/movimientos/', data);
    alert('Movimiento registrado');
  } catch (err) {
    console.error('Error al registrar movimiento:', err);
    alert('Error al registrar');
  }
};

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registrar Movimiento</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <select name="producto" onChange={handleChange} required className="border p-2 w-full">
          <option value="">Selecciona producto</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
        </select>
        <select name="tipo" value={movimiento.tipo} onChange={handleChange} className="border p-2 w-full">
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
        <input type="number" name="cantidad" min="1" value={movimiento.cantidad} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Registrar Movimiento</button>
      </form>
    </div>
  );
};

export default Movimientos;
