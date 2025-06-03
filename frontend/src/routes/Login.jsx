// src/routes/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/token/", {
        username: usuario,
        password: password,
      });
      localStorage.setItem("token", res.data.access);
      navigate("/dashboard");
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Iniciar sesión</h2>
      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
