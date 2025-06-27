// src/pages/Movimientos.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Movimientos() {
  const [productos, setProductos] = useState([])
  const [movimiento, setMovimiento] = useState({
    producto: '',
    tipo: 'entrada',
    cantidad: 1,
    almacen: ''          // ← añadimos almacen
  })
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    api.get('/productos/')
       .then(({ data }) => setProductos(data))
       .catch(err => console.error('Error cargando productos:', err))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setMovimiento(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.post('/movimientos/', {
        producto:  parseInt(movimiento.producto, 10),
        tipo:       movimiento.tipo,
        cantidad:   parseInt(movimiento.cantidad, 10),
        almacen:    movimiento.almacen
      })
      setMensaje('✅ Movimiento registrado')
      setMovimiento({
        producto: '',
        tipo: 'entrada',
        cantidad: 1,
        almacen: ''
      })
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      console.error('Error al registrar movimiento:', err)
      setMensaje('❌ Error al registrar movimiento')
      setTimeout(() => setMensaje(''), 3000)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Registrar Movimiento</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4 max-w-md"
      >
        <select
          name="producto"
          value={movimiento.producto}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecciona producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>

        <select
          name="tipo"
          value={movimiento.tipo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        <input
          type="number"
          name="cantidad"
          min="1"
          value={movimiento.cantidad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="almacen"
          placeholder="Almacén"
          value={movimiento.almacen}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-4 py-2"
        >
          Registrar Movimiento
        </button>

        {mensaje && (
          <p className="mt-2 text-center">{mensaje}</p>
        )}
      </form>
    </div>
  )
}
