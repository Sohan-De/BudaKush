'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Connexion impossible');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Erreur réseau, réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f3f16', padding: 20 }}>
      <form onSubmit={submit} style={{ background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 360, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 22 }}>Administration</h1>
        <p style={{ margin: '0 0 18px', color: '#555', fontSize: 14 }}>BudaKush CBD</p>
        <label htmlFor="admin-password" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Mot de passe</label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #bbb', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: '#b3261e', fontSize: 13, margin: '10px 0 0' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 16, width: '100%', padding: '11px', border: 'none', borderRadius: 6, background: '#f5c518', color: '#0f3f16', fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
