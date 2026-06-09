import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { loginRequest } from '../services/authService';

interface LocationState {
  from?: string;
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;

  return {
    question: `${a} + ${b}`,
    answer: a + b,
  };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useUser();

  const [email, setEmail] = useState('fernanda@gmail.com');
  const [password, setPassword] = useState('Hola123*');
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');

  const state = location.state as LocationState | null;
  const redirectTo = state?.from || '/admin';

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Number(captchaAnswer) !== captcha.answer) {
      setError('CAPTCHA incorrecto. Inténtalo nuevamente.');
      refreshCaptcha();
      return;
    }

    try {
      setError('');

      const response = await loginRequest(email, password);

      setCurrentUser(response.user);

      if (response.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión.',
      );

      refreshCaptcha();
    }
  };

  return (
    <section className="auth-grid">
      <div className="auth-side">
        <p className="eyebrow">Acceso seguro</p>
        <h1>Inicia sesión en tu tienda K-pop</h1>
        <p className="hero-text">
          Ingresa con tu cuenta y resuelve el CAPTCHA para acceder al sistema.
        </p>

        <div className="soft-panel">
          <h3>Cuenta admin backend</h3>
          <p><strong>Correo:</strong> fernanda@gmail.com</p>
          <p><strong>Contraseña:</strong> Hola123*</p>
        </div>
      </div>

      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <div className="captcha-box">
          <div>
            <p className="muted">CAPTCHA</p>
            <h3>¿Cuánto es {captcha.question}?</h3>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={refreshCaptcha}
          >
            Cambiar
          </button>
        </div>

        <label>
          Respuesta del CAPTCHA
          <input
            className="input"
            type="number"
            required
            value={captchaAnswer}
            onChange={(event) => setCaptchaAnswer(event.target.value)}
            placeholder="Escribe el resultado"
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary full-width" type="submit">
          Entrar
        </button>

        <p className="muted auth-link-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </section>
  );
}