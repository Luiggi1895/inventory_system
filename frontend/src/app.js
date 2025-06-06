import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Productos from "./routes/Productos";
import EscanearQR from "./routes/EscanearQR";
import Movimientos from './routes/Movimientos';
// import PrivateRoute from "./components/PrivateRoute"; ← puedes comentar esto

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/escanear" element={<EscanearQR />} />
        {/* ENTRADA DIRECTA A PRODUCTOS */}
        <Route path="/escanear" element={<EscanearQR />} />
        <Route path="/" element={<Navigate to="/productos" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
