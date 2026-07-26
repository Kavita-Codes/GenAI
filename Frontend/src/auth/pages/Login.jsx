import { useState } from 'react';
import { FaBrain, FaBullseye, FaChartBar, FaCalendarAlt, FaHandSparkles, FaExclamationTriangle, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await handleLogin({ email, password });
      if (result && result.success) {
        navigate('/');
      } else {
        setError(result?.message || 'Login failed. Please try again.');
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
          <span className="spinner-text">Signing you in...</span>
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
            Ace Your Next<br />
            <span>Interview</span> with AI
          </h1>
          <p className="auth-left-desc">
            Get personalized interview questions, skill gap analysis, and a 14-day preparation roadmap — all powered by Gemini AI.
          </p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaBullseye style={{ display: "inline", color: "#f97316" }} /></div>
              <span className="auth-feature-text">AI-generated technical questions tailored to your role</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaChartBar style={{ display: "inline", color: "#3b82f6" }} /></div>
              <span className="auth-feature-text">Instant resume-to-job match score analysis</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><FaCalendarAlt style={{ display: "inline", color: "#3b82f6" }} />️</div>
              <span className="auth-feature-text">14-day personalized preparation roadmap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon"><FaHandSparkles style={{ display: "inline", color: "#f97316" }} /></div>
            <h2 className="auth-card-title">Welcome Back!</h2>
            <p className="auth-card-subtitle">Sign in to continue your interview prep</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error-msg"><FaExclamationTriangle style={{ display: "inline", color: "#f97316" }} />️ {error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
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
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><FaLock style={{ display: "inline", color: "#3b82f6" }} /></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Signing In...' : '→ Sign In'}
            </button>

            <p className="auth-switch-text">
              Don't have an account?{' '}
              <span className="auth-switch-link" onClick={() => navigate('/register')}>
                Create Account
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;