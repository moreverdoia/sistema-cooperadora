import { useState } from 'react';
import "../styles/login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onLogin(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <p className="eyebrow">Sistema Cooperadora</p>
            <h2>Iniciar sesión</h2>
          </div>
        </div>

        {error && <p className="mensaje error">{error}</p>}

        <div className="formulario">
          <div className="campo">
            <label>Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Ingresar</button>
        </div>
      </form>
    </div>
  );
}

export default Login;