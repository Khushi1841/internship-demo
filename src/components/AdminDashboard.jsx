import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://internship-demo-tna6.onrender.com/api/admin/users');
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Cannot connect to server. Is the backend running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              View all registered candidates and their resumes.
            </p>
          </div>
        </div>

        <button onClick={fetchUsers} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error ? (
        <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '16px 20px', fontWeight: '500' }}>Candidate</th>
                <th style={{ padding: '16px 20px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: '500' }}>Education</th>
                <th style={{ padding: '16px 20px', fontWeight: '500' }}>Skills</th>
                <th style={{ padding: '16px 20px', fontWeight: '500' }}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No candidates registered yet.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '500' }}>{user.name || 'N/A'}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {user.is_verified ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                          <CheckCircle size={14} /> Verified
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                          <XCircle size={14} /> Unverified
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '0.9rem' }}>{user.course || '-'}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {user.university ? `${user.university} ('${user.graduation_year})` : '-'}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '0.9rem' }}>
                      {user.skills ? (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {user.skills.split(',').slice(0, 2).map((skill, i) => (
                            <span key={i} style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '0.8rem' }}>
                              {skill.trim()}
                            </span>
                          ))}
                          {user.skills.split(',').length > 2 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>+{user.skills.split(',').length - 2}</span>}
                        </div>
                      ) : '-'}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {user.resume_path ? (
                        <a 
                          href={`https://internship-demo-tna6.onrender.com/uploads/${user.resume_path}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}
                        >
                          <Download size={16} /> Download
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No File</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
