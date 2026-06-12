import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PASSWORD } from '../../data';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('wedding-admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-olive-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-cream font-serif text-2xl">L</span>
          </div>
          <h1 className="font-serif text-slate-700 text-3xl font-light tracking-[0.08em]">Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Luz & Manuel · 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-lg shadow-slate-200/50 p-8 space-y-4 border border-olive-100">
          <div>
            <label className="block text-slate-500 text-xs tracking-[0.15em] uppercase mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-olive-50/50 border border-olive-200 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm rounded-sm"
              placeholder="Ingresa la contraseña"
              autoFocus
            />
          </div>

          {error && <p className="text-rose-500 text-xs text-center">Contraseña incorrecta</p>}

          <button type="submit" className="w-full py-3 bg-olive-600 text-cream text-sm tracking-[0.15em] uppercase hover:bg-olive-700 transition-colors rounded-sm">
            Entrar
          </button>

          <a href="/" className="block text-center text-slate-300 text-[10px] tracking-[0.15em] uppercase hover:text-slate-500 transition-colors mt-2">
            Volver a la invitación
          </a>
        </form>
      </div>
    </div>
  );
}
