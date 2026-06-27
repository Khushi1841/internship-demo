import React, { useState } from 'react';
import { Mail, User, ArrowRight, Loader2, Lock, Sparkles } from 'lucide-react';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Keep for UI, but not strictly auth-checked in this assignment
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Direct Login
        const res = await fetch('https://internship-demo-tna6.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          onAuthSuccess({ email, name: data.user.name, skipOtp: true });
        } else {
          setError(data.error || "Login failed");
        }
      } else {
        // Signup requires OTP
        const res = await fetch('https://internship-demo-tna6.onrender.com/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        
        const data = await res.json();
        if (res.ok) {
          onAuthSuccess({ email, name, previewUrl: data.previewUrl, skipOtp: false });
        } else {
          setError(data.error || "Failed to send OTP");
        }
      }
    } catch (err) {
      setError("Cannot connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container animate-pop-in">
      
      {/* Left side: Premium Image */}
      <div className="auth-image-pane">
        <img src="/login-cover.png" alt="Premium Tech Background" className="animate-ken-burns" />
        <div className="auth-image-overlay" />
        <div style={{ position: 'absolute', bottom: '60px', left: '60px', zIndex: 30 }}>
          <div style={{ display: 'inline-flex', padding: '15px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={32} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: '800', textShadow: '0 4px 20px rgba(0,0,0,0.5)', maxWidth: '400px', lineHeight: '1.2' }}>
            {isLogin ? 'Welcome Sign In' : 'Welcome Sign Up'}
          </h1>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-pane">
        <div style={{ textAlign: 'center', marginBottom: '35px' }} className="animate-slide-up">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: '800' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {isLogin ? 'Enter your credentials to continue' : 'Join us to start your application'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animationDelay: '0.1s' }} className="animate-slide-up">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '48px' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.95rem', marginBottom: '15px', textAlign: 'center', fontWeight: '500' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '16px', fontSize: '1.1rem', borderRadius: '16px' }} disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {isLogin ? 'Log In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '35px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', animationDelay: '0.2s' }} className="animate-slide-up">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AuthForm;
