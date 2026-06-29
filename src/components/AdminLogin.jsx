import React, { useState } from 'react';
import { Lock, ArrowRight, X, Eye, EyeOff } from 'lucide-react';

const AdminLogin = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError('Incorrect admin password');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px', margin: '0 auto', position: 'relative' }}>
      <button onClick={onCancel} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
        <X size={20} />
      </button>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)', marginBottom: '15px' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter the master password to view candidates.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            className="form-input"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            style={{ textAlign: 'center', letterSpacing: '2px', paddingRight: '40px', paddingLeft: '40px' }}
            autoFocus
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px', marginTop: '-10px' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Unlock Dashboard
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
