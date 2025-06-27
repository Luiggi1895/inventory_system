// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Productos  from "./pages/Productos";
import Movimientos from "./pages/Movimientos";
import EscanearQR from "./pages/EscanearQR";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"       element={<Login />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/productos"   element={<Productos />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/escanear"    element={<EscanearQR />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
