import { useRef, useState } from 'react';
import { FaBrain, FaExclamationTriangle, FaFileAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Upload, Sparkles, FileText, BrainCircuit, LogOut, User } from 'lucide-react';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

const Home = () => {
  const { loading, generateReport } = useInterview();
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const resumeInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];

    if (!resumeFile) {
      alert('<FaExclamationTriangle style={{ display: "inline", color: "#f97316" }} />️ Please select a PDF resume file.');
      return;
    }

    if (!jobDescription.trim()) {
      alert('<FaExclamationTriangle style={{ display: "inline", color: "#f97316" }} />️ Please enter the job description.');
      return;
    }

    try {
      const data = await generateReport({
        resumeFile,
        jobDescription,
        selfDescription,
      });

      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('<FaTimesCircle style={{ display: "inline", color: "#ef4444" }} /> Failed to generate report. Please try again.');
    }
  };

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon"><FaBrain style={{ display: "inline", color: "#3b82f6" }} /></div>
          <span className="navbar-brand-name">InterviewAI</span>
        </div>
        <div className="navbar-right">
          {user && (
            <div className="navbar-user-info  ">
              <div className="navbar-avatar ">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <span className="navbar-username">
                {user.name || user.username}
              </span>
            </div>
          )}
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={14} style={{ display: 'inline', marginRight: 5 }} />
            Logout
          </button>
        </div>
      </nav>

      {/* Home Content */}
      <div className="home-page">
        <div className="home-container">
          {/* Header */}
          <div className="home-header">
            <div className="home-badge">
              <Sparkles size={14} />
              AI-Powered Interview Prep
            </div>
            <h1 className="home-title">
              Generate Your<br />
              <span>Interview Report</span>
            </h1>
            <p className="home-subtitle">
              Upload your resume, describe the job, and let Gemini AI craft a personalized interview preparation kit just for you.
            </p>
          </div>

          {/* Form Grid */}
          <div className="home-grid">
            {/* Left: Job Description */}
            <div className="form-card">
              <div className="form-card-label">
                <div className="form-card-label-icon">
                  <FileText size={14} />
                </div>
                Job Description
              </div>
              <textarea
                className="home-textarea"
                style={{ height: '440px' }}
                placeholder="Paste the job description here. Include role, responsibilities, required skills, and any other details..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Right: Upload + Self Desc + Button */}
            <div className="home-right-col">
              {/* Resume Upload */}
              <div className="form-card">
                <div className="form-card-label">
                  <div className="form-card-label-icon">
                    <Upload size={14} />
                  </div>
                  Resume <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>(PDF only)</span>
                </div>
                <div className="upload-zone">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    id="resumeFile"
                    name="resume"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  
                  />
                  <div className="upload-icon">
                    <Upload size={22} />
                  </div>
                  <div className="upload-title">
                    {selectedFile ? selectedFile.name : 'Drop your resume here'}
                  </div>
                  <div className="upload-subtitle">
                    {selectedFile ? 'File selected successfully' : 'or click to browse files'}
                  </div>
                  {!selectedFile ? (
                    <div className="upload-badge"> </div>
                  ) : (
                    <div className="file-selected-indicator">
                      <FaCheckCircle style={{ display: "inline", color: "#22c55e" }} /> {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Self Description */}
              <div className="form-card">
                <div className="form-card-label">
                  <div className="form-card-label-icon">
                    <BrainCircuit size={14} />
                  </div>
                  About Yourself <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 400 }}>(optional)</span>
                </div>
                <textarea
                  className="home-textarea"
                  style={{ height: '120px' }}
                  placeholder="Describe your strengths, experience level, goals, or anything you want the AI to consider..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <button
                className="generate-btn"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating your report...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Interview Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;