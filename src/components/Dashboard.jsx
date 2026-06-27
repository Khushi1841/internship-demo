import React, { useState } from 'react';
import ResumeUpload from './ResumeUpload';
import DetailsForm from './DetailsForm';
import ProgressBar from './ProgressBar';
import Confetti from 'react-confetti';
import { jsPDF } from 'jspdf';
import { LogOut, CheckCircle, Download } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [extractedResumeData, setExtractedResumeData] = useState(null);

  const handleUploadSuccess = (parsedData) => {
    setExtractedResumeData(parsedData);
    setResumeUploaded(true);
  };

  const handleDetailsSubmit = (data) => {
    setDetailsData(data);
    setDetailsSaved(true);
  };

  const isComplete = resumeUploaded && detailsSaved;
  const progress = isComplete ? 100 : (resumeUploaded ? 50 : 0);

  const downloadReceipt = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text('Internship Application Receipt', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Candidate Name: ${user?.name || 'N/A'}`, 20, 55);
    doc.text(`Email Address: ${user?.email || 'N/A'}`, 20, 65);
    
    if (detailsData) {
      doc.text(`Course: ${detailsData.course || 'N/A'}`, 20, 80);
      doc.text(`University: ${detailsData.university || 'N/A'}`, 20, 90);
      doc.text(`Graduation Year: ${detailsData.graduationYear || 'N/A'}`, 20, 100);
      doc.text(`Location: ${detailsData.location || 'N/A'}`, 20, 110);
      doc.text(`Skills: ${detailsData.skills || 'N/A'}`, 20, 120);
    }
    
    doc.text('Status: Verified & Completed', 20, 140);
    doc.save(`${user?.name || 'Application'}_Receipt.pdf`);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {isComplete && <Confetti recycle={false} numberOfPieces={500} gravity={0.1} />}
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '5px' }}>
            Welcome, {user?.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete your profile to finish the onboarding process.
          </p>
        </div>
        
        <button onClick={onLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <ProgressBar progress={progress} />

        {isComplete ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '20px' }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>You're All Set!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', marginBottom: '30px' }}>
              Your resume has been uploaded and your details are saved securely in the database. Thank you for completing your profile for the internship application.
            </p>
            
            <button onClick={downloadReceipt} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <Download size={18} />
              Download Receipt
            </button>
          </div>
        ) : (
          <>
            {/* Step 1: Resume */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-40px', top: '30px', width: '24px', height: '24px', borderRadius: '50%', background: resumeUploaded ? 'var(--success)' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                1
              </div>
              <ResumeUpload onUploadSuccess={handleUploadSuccess} email={user?.email} />
            </div>

            {/* Step 2: Details Form */}
            <div style={{ position: 'relative', opacity: resumeUploaded ? 1 : 0.5, pointerEvents: resumeUploaded ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
              <div style={{ position: 'absolute', left: '-40px', top: '30px', width: '24px', height: '24px', borderRadius: '50%', background: detailsSaved ? 'var(--success)' : (resumeUploaded ? 'var(--accent-primary)' : 'var(--glass-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                2
              </div>
              <DetailsForm onSubmitSuccess={handleDetailsSubmit} initialName={user?.name !== 'User' ? user?.name : ''} email={user?.email} prefillData={extractedResumeData} />
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;
