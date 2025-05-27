import React, { useEffect, useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = () => {
    fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          onLogin();
        } else {
          alert('Credenciales inválidas');
        }
      })
      .catch(() => alert('Error al iniciar sesión'));
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={iniciarSesion}>Entrar</button>
    </div>
  );
}

function App() {
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem('access'));
  const [productoId, setProductoId] = useState('');
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [predicciones, setPredicciones] = useState({});
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalEntradas: 0,
    totalSalidas: 0,
    alertas: 0,
    prediccionesCriticas: []
  });

  const headersAuth = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access')
  };

  const cargarDatos = () => {
    fetch('http://localhost:8000/api/productos/', { headers: headersAuth })
      .then(res => res.json())
      .then(data => setProductos(data));

    fetch('http://localhost:8000/api/movimientos/', { headers: headersAuth })
      .then(res => res.json())
      .then(data => setMovimientos(data));

    fetch('http://localhost:8000/api/resumen/', { headers: headersAuth })
      .then(res => res.json())
      .then(data => setResumen(data));
  };

  useEffect(() => {
    if (autenticado) {
      cargarDatos();
    }
  }, [autenticado]);

  const registrarProducto = () => {
    const nuevoProducto = { nombre, descripcion, codigo };

    fetch('http://localhost:8000/api/productos/', {
      method: 'POST',
      headers: headersAuth,
      body: JSON.stringify(nuevoProducto)
    })
      .then(res => res.json())
      .then(data => {
        alert('Producto registrado');
        setProductos(prev => [...prev, data]);
        setNombre('');
        setDescripcion('');
        setCodigo('');
      });
  };

  const registrarMovimiento = () => {
    const nuevoMovimiento = {
      producto: productoId,
      tipo,
      cantidad: parseInt(cantidad)
    };

    fetch('http://localhost:8000/api/movimientos/', {
      method: 'POST',
      headers: headersAuth,
      body: JSON.stringify(nuevoMovimiento)
    })
      .then(res => res.json())
      .then(() => {
        alert('Movimiento registrado');
        setProductoId('');
        setTipo('');
        setCantidad('');
        cargarDatos();
      });
  };

  const predecirStock = (productoId) => {
    fetch(`http://localhost:8000/api/predecir_stock/${productoId}/`, {
      headers: headersAuth
    })
      .then(res => res.json())
      .then(data => {
        if (data.prediccion !== undefined) {
          setPredicciones(prev => ({ ...prev, [productoId]: data.prediccion }));
        } else {
          alert(data.error || 'Error al predecir');
        }
      });
  };

  if (!autenticado) return <Login onLogin={() => setAutenticado(true)} />;

  return (
    <div>
      <h1>Sistema de Inventario</h1>

      <h2>Resumen del Inventario</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>Total de Productos: {resumen.totalProductos}</div>
        <div>Total de Entradas: {resumen.totalEntradas}</div>
        <div>Total de Salidas: {resumen.totalSalidas}</div>
        <div style={{ color: 'red' }}>Alertas: {resumen.alertas}</div>
      </div>

      <h3>Productos más críticos:</h3>
      <ul>
        {resumen.prediccionesCriticas.map(p => (
          <li key={p.id}>
            {p.nombre}: 🧠 {p.prediccion} unidades estimadas
          </li>
        ))}
      </ul>

      <h2>Registrar Producto</h2>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
      <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" />
      <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código" />
      <button onClick={registrarProducto}>Registrar</button>

      <h2>Registrar Movimiento</h2>
      <select value={productoId} onChange={e => setProductoId(e.target.value)}>
        <option value="">Seleccione producto</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
      <select value={tipo} onChange={e => setTipo(e.target.value)}>
        <option value="">Tipo</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>
      <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Cantidad" />
      <button onClick={registrarMovimiento}>Registrar Movimiento</button>

      <h2>Lista de Productos</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Código</th>
            <th>Stock</th>
            <th>QR</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.codigo}</td>
              <td>{p.stock}</td>
              <td><img src={`http://localhost:8000${p.qr}`} alt="QR" width="80" /></td>
              <td>
                <button onClick={() => predecirStock(p.id)}>Predecir Stock</button>
                {predicciones[p.id] && <div>🧠 {predicciones[p.id]}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}

export default App;
