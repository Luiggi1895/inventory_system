// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiList,
  FiClipboard,
  FiCamera,
  FiTrendingUp,
  FiSettings,
} from 'react-icons/fi';

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-2 rounded hover:bg-gray-100 ${
      isActive ? 'bg-gray-200 font-semibold text-blue-600' : 'text-gray-700'
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
      <nav className="p-6 space-y-4">
        <NavLink to="/dashboard" className={linkClasses}>
          <FiHome size={20} /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/productos" className={linkClasses}>
          <FiList size={20} /> <span>Productos</span>
        </NavLink>
        <NavLink to="/movimientos" className={linkClasses}>
          <FiClipboard size={20} /> <span>Movimientos</span>
        </NavLink>
        <NavLink to="/escanear" className={linkClasses}>
          <FiCamera size={20} /> <span>Escaneo QR</span>
        </NavLink>
        <NavLink to="/prediccion" className={linkClasses}>
          <FiTrendingUp size={20} /> <span>Predicción</span>
        </NavLink>
      </nav>
      <div className="p-6">
        <FiSettings size={24} className="hover:text-blue-600 cursor-pointer" />
      </div>
    </aside>
  );
}
