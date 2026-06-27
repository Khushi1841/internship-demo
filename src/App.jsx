import React, { useState } from 'react';
import './index.css';
import AuthForm from './components/AuthForm';
import OtpVerification from './components/OtpVerification';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [step, setStep] = useState('auth'); // auth, otp, dashboard, admin
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.skipOtp) {
      setStep('dashboard');
    } else {
      setStep('otp');
    }
  };

  const handleOtpVerify = () => {
    setStep('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setStep('auth');
  };

  return (
    <div className="page-container">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hidden Admin Trigger */}
      <button 
        onClick={() => setStep((step === 'admin' || step === 'admin-login') ? 'auth' : 'admin-login')}
        style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px', 
          background: 'var(--accent-gradient)', 
          border: 'none', 
          color: 'white', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          cursor: 'pointer', 
          zIndex: 100,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {(step === 'admin' || step === 'admin-login') ? 'Back to App' : '🛡️ Admin Access'}
      </button>

      {step === 'auth' && (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
      
      {step === 'otp' && (
        <OtpVerification 
          email={user?.email} 
          previewUrl={user?.previewUrl}
          onVerify={handleOtpVerify} 
          onBack={() => setStep('auth')}
        />
      )}
      
      {step === 'dashboard' && (
        <div className="app-container">
          <Dashboard user={user} onLogout={handleLogout} />
        </div>
      )}

      {step === 'admin-login' && (
        <AdminLogin onSuccess={() => setStep('admin')} onCancel={() => setStep('auth')} />
      )}

      {step === 'admin' && (
        <div className="app-container">
          <AdminDashboard />
        </div>
      )}
    </div>
  );
}

export default App;
