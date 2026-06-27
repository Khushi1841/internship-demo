import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';

const OtpVerification = ({ email, onVerify, onBack, previewUrl }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('https://internship-demo-1.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });
      const data = await res.json();
      
      if (res.ok) {
        onVerify();
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
          <ShieldCheck size={32} />
        </div>
      </div>
      
      <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
        Verify your email
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.95rem', lineHeight: '1.5' }}>
        We've sent a 4-digit verification code to<br />
        <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
      </p>

      {previewUrl && (
        <a href={previewUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', textDecoration: 'none', background: 'rgba(99, 102, 241, 0.1)', padding: '8px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
          <ExternalLink size={16} /> Click here to see your Test OTP
        </a>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="form-input"
              style={{ 
                width: '60px', 
                height: '65px', 
                textAlign: 'center', 
                fontSize: '1.5rem', 
                fontWeight: '600',
                padding: '0',
                borderRadius: '16px'
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
          {loading ? (
            <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              Verify Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OtpVerification;
