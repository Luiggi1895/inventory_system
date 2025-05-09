import React, { useEffect, useState } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalEntradas: 0,
    totalSalidas: 0,
    alertas: 0,
  });
  
  useEffect(() => {
    fetch('http://localhost:8000/api/resumen/')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error('Error al cargar resumen:', err));
  }, []);
  

  // Cargar productos al iniciar
  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error:', error));
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/api/movimientos/')
      .then(res => res.json())
      .then(data => setMovimientos(data))
      .catch(err => console.error('Error al cargar movimientos:', err));
  }, []);
  
  // Enviar producto nuevo
  const registrarProducto = () => {
    const nuevoProducto = {
      nombre,
      descripcion,
      codigo,
    };

    fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => response.json())
      .then(data => {
        alert('Producto registrado');
        setProductos(prev => [...prev, data]); // actualizar tabla
        setNombre('');
        setDescripcion('');
        setCodigo('');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar');
      });
  };
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    minWidth: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };
  
  return (
    
    <div>
      <h1>Sistema de Inventario</h1>

      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Resumen del Inventario</h2>
<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
  <div style={cardStyle}>
    <h3>Total de Productos</h3>
    <p>{resumen.totalProductos}</p>
  </div>
  <div style={cardStyle}>
    <h3>Total de Entradas</h3>
    <p>{resumen.totalEntradas}</p>
  </div>
  <div style={cardStyle}>
    <h3>Total de Salidas</h3>
    <p>{resumen.totalSalidas}</p>
  </div>
  <div style={{ ...cardStyle, backgroundColor: '#ffe5e5', color: 'red' }}>
    <h3>Alertas Activas</h3>
    <p>{resumen.alertas}</p>
  </div>
</div>


      <h2>Registrar Producto</h2>
      <label>Nombre:</label>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <label>Descripción:</label>
      <input value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      <label>Código:</label>
      <input value={codigo} onChange={e => setCodigo(e.target.value)} />
      <button onClick={registrarProducto}>Registrar</button>

      <hr />

      <h2>Lista de Productos</h2>
      <table border="1">
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
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.codigo}</td>
              <td>{p.stock}</td>
              <td>
                <img src={`http://localhost:8000${p.qr}`} alt="QR" width="80" />
              </td>
            </tr>
          ))}
        </tbody>
        </table>

<hr />

<h2>Historial de Movimientos</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map(m => (
          <tr key={m.id}>
            <td>{m.producto}</td>
            <td>{m.tipo}</td>
            <td>{m.cantidad}</td>
            <td>{new Date(m.fecha).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div> // ✅ este es el único cierre del div raíz
);
}

export default App;
