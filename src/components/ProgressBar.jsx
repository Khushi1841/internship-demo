import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ width: '100%', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        <span>Profile Setup</span>
        <span>{progress}%</span>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--accent-gradient)',
            borderRadius: '10px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
