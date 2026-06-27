import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, X, Loader2 } from 'lucide-react';

const ResumeUpload = ({ onUploadSuccess, email }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setError('');
    // Ensure size is under 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    if (selectedFile.type === 'application/pdf' || selectedFile.type.includes('word')) {
      setFile(selectedFile);
    } else {
      setError("Please upload a PDF or Word document.");
    }
  };

  const performUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('email', email);

    try {
      const res = await fetch('https://internship-demo-tna6.onrender.com/api/users/resume', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        onUploadSuccess(data.parsedData);
      } else {
        setError(data.error || "Failed to upload resume");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', width: '100%', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Upload Resume</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Please upload your most recent resume (PDF or DOCX, max 5MB).
      </p>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>}

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <UploadCloud size={32} />
            </div>
          </div>
          <p style={{ fontWeight: '500', marginBottom: '5px' }}>
            Click to upload or drag and drop
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            PDF or DOCX up to 5MB
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '15px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ color: 'var(--accent-secondary)' }}>
              <FileText size={24} />
            </div>
            <div>
              <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{file.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setFile(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {file && (
        <button 
          onClick={performUpload} 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '20px' }}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              Continue with this file
              <CheckCircle size={18} />
            </>
          )}
        </button>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ResumeUpload;
