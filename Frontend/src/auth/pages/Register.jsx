import { useState, useEffect } from 'react';
import { FaBrain, FaExclamationTriangle, FaEnvelope, FaLock, FaFileAlt, FaRobot, FaRocket, FaStar, FaCheckCircle, FaUser, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { loading, user, handleRegister } = useAuth();
   const navigate = useNavigate();

  // Agar user already logged in hai to home pe redirect karo
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [loading, user, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const result = await handleRegister({ name, username, email, password });
      if (result && result.success) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.log(error)
      setError('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <span className="spinner-text">Creating your account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon"><FaBrain style={{ display: "inline", color: "#3b82f6" }} /></div>
            <span className="auth-brand-name">InterviewAI</span>
          </div>
          <h1 className="auth-left-heading">
            Start Your Journey<br />
            to <span>Interview Success</span>
          </h1>
          <p className="auth-left-desc">
            Join thousands of candidates who use AI to prepare smarter and land their dream jobs faster.
          </p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaFileAlt style={{ display: "inline", color: "#3b82f6" }} /></div>
              <span className="auth-feature-text">Upload resume & get instant AI analysis</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaRobot style={{ display: "inline", color: "#3b82f6" }} /></div>
              <span className="auth-feature-text">Behavioral & technical questions by Gemini AI</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaRocket style={{ display: "inline", color: "#f97316" }} /></div>
              <span className="auth-feature-text">Skill gap identification & improvement plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="auth-right">
        <div className="auth-card" style={{ padding: '28px', maxWidth: '390px' }}>
          <div className="auth-card-header">
            <div className="auth-card-icon" style={{ width: '52px', height: '52px', fontSize: '22px', borderRadius: '14px' }}><FaStar style={{ display: "inline", color: "#fb923c" }} /></div>
            <h2 className="auth-card-title" style={{ fontSize: '22px', marginBottom: '4px' }}>Create Account</h2>
            <p className="auth-card-subtitle">Join InterviewAI and start preparing today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '14px' }}>
            {error && <div className="auth-error-msg"><FaExclamationTriangle style={{ display: "inline", color: "#f97316" }} />️ {error}</div>}
            {success && <div className="auth-success-msg"><FaCheckCircle style={{ display: "inline", color: "#22c55e" }} /> {success}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaUser style={{ display: "inline", color: "#3b82f6" }} /></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username <span style={{color:'#a855f7'}}>*</span></label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaTag style={{ display: "inline", color: "#3b82f6" }} />️</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span style={{color:'#a855f7'}}>*</span></label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaEnvelope style={{ display: "inline", color: "#3b82f6" }} />️</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password <span style={{color:'#a855f7'}}>*</span></label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaLock style={{ display: "inline", color: "#3b82f6" }} /></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Creating Account...' : '→ Create Account'}
            </button>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <span className="auth-switch-link" onClick={() => navigate('/login')}>
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;