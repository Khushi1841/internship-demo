import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, MapPin, Loader2, Save } from 'lucide-react';

const DetailsForm = ({ onSubmitSuccess, initialName, email, prefillData }) => {
  const [formData, setFormData] = useState({
    name: initialName || '',
    course: '',
    university: '',
    graduationYear: '',
    location: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        ...prefillData
      }));
      
      // Determine what was missed
      const expectedFields = ['course', 'university', 'graduationYear', 'location', 'skills'];
      const missing = expectedFields.filter(field => !prefillData[field] || prefillData[field].trim() === '');
      setMissingFields(missing);
    }
  }, [prefillData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://internship-demo-tna6.onrender.com/api/users/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...formData })
      });
      const data = await res.json();
      
      if (res.ok) {
        onSubmitSuccess(formData);
      } else {
        setError(data.error || "Failed to save details");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', width: '100%' }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Personal & Academic Details</h3>
      
      {prefillData && missingFields.length > 0 && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', marginBottom: '20px', color: '#fca5a5', fontSize: '0.95rem' }}>
          <strong>Note:</strong> We couldn't find some information ({missingFields.join(', ')}) in your document. Please fill the empty fields manually.
        </div>
      )}
      {prefillData && missingFields.length === 0 && (
         <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', marginBottom: '20px', color: '#6ee7b7', fontSize: '0.95rem' }}>
          <strong>Success:</strong> All details successfully extracted from your resume! Please review and save.
        </div>
      )}

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                pattern="[a-zA-Z\s]+"
                title="Only letters and spaces are allowed"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label">Course / Degree</label>
            <div style={{ position: 'relative' }}>
              <BookOpen size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                name="course"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="B.Tech Computer Science"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '10px', gridColumn: '1 / -1' }}>
            <label className="form-label">University / College</label>
            <div style={{ position: 'relative' }}>
              <GraduationCap size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                name="university"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Indian Institute of Technology"
                value={formData.university}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              className="form-input"
              placeholder="2025"
              min="2000"
              max="2030"
              value={formData.graduationYear}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label">Current Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                name="location"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Bangalore, Karnataka"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px', gridColumn: '1 / -1' }}>
            <label className="form-label">Top Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-input"
              placeholder="React, Node.js, UI/UX Design"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }} disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <Save size={18} />
                Save Details
              </>
            )}
          </button>
        </div>
      </form>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DetailsForm;
