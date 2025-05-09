// src/ProductoTabla.js
import React, { useEffect, useState } from 'react';

function ProductoTabla() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Código</th>
            <th>Stock</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.codigo}</td>
              <td>{producto.stock}</td>
              <td>
                <img
                  src={`http://localhost:8000${producto.qr}`}
                  alt="QR"
                  width="100"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductoTabla;
