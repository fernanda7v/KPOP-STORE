import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/authService';

type Strength = 'Débil' | 'Intermedia' | 'Fuerte';

function getPasswordStrength(password: string): Strength {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'Débil';
  if (score <= 4) return 'Intermedia';
  return 'Fuerte';
}

function getStrengthClass(strength: Strength) {
  if (strength === 'Débil') return 'strength-weak';
  if (strength === 'Intermedia') return 'strength-medium';
  return 'strength-strong';
}

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError('');
      setMessage('');

      const response = await registerRequest(name, email, password);

      setMessage(
        `Usuario creado correctamente. Contraseña guardada como: ${response.passwordStrength}.`,
      );

      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar el usuario.',
      );
    }
  };

  return (
    <section className="auth-grid">
      <div className="auth-side">
        <p className="eyebrow">Registro seguro</p>
        <h1>Crea tu cuenta y empieza a comprar</h1>
        <p className="hero-text">
          El sistema analiza tu contraseña como débil, intermedia o fuerte.
        </p>

        <div className="soft-panel">
          <h3>Consejo</h3>
          <p className="muted">
            Una contraseña fuerte debe tener mayúsculas, minúsculas, números y símbolos.
          </p>
        </div>
      </div>

      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

        <label>
          Nombre
          <input
            className="input"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Correo
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Contraseña
          <input
            className="input"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {password && (
          <div className={`password-strength ${getStrengthClass(passwordStrength)}`}>
            <span>Nivel de contraseña:</span>
            <strong>{passwordStrength}</strong>
          </div>
        )}

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary full-width" type="submit">
          Registrarme
        </button>

        <p className="muted auth-link-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  );
}