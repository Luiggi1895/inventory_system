// src/pages/Prediccion.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PrediccionStock from '../components/PrediccionStock'
import api from '../services/api'

export default function Prediccion() {
  const { id } = useParams()
  const [valores, setValores] = useState(null)
  const [producto, setProducto] = useState(null)

  useEffect(() => {
    // Obtener datos del producto (opcional, para mostrar nombre)
    api.get(`/productos/${id}/`).then(res => setProducto(res.data))
    // Obtener predicción
    api.get(`/prediccion/${id}/`)
       .then(res => setValores(res.data.valores))
       .catch(() => setValores([]))
  }, [id])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Predicción de ventas para: {producto?.nombre || `#${id}`}
      </h2>

      {valores === null ? (
        <p>Cargando predicción…</p>
      ) : valores.length === 0 ? (
        <p>No hay datos de predicción.</p>
      ) : (
        <PrediccionStock valores={valores} />
      )}
    </div>
  )
}
