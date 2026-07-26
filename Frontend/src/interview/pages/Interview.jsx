import { useEffect } from 'react';
import { FaBrain, FaBullseye, FaChartLine, FaCalendarAlt, FaBoxOpen, FaThumbsUp, FaTrophy } from 'react-icons/fa';
import { useInterview } from '../hooks/useInterview';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { LogOut, ChevronLeft, Brain, MessageSquare, Map, Zap } from 'lucide-react';
import { useState } from 'react';

const Interview = () => {
  const { report, getReport, loading } = useInterview();
  const [activeTab, setActiveTab] = useState('technical');
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { reports, getReports } = useInterview();

  useEffect(() => {
    if (interviewId) {
      getReport(interviewId);
    }
  }, [interviewId]);

  useEffect(() => {
    getReports();
  }, []);

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  if (loading || !report) {
    return (
      <>
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand" onClick={() => navigate('/')}>
            <div className="navbar-brand-icon"><FaBrain style={{ display: "inline", color: "#3b82f6" }} /></div>
            <span className="navbar-brand-name">InterviewAI</span>
          </div>
          <div className="navbar-right">
            <button className="btn-logout" onClick={onLogout}>
              <LogOut size={14} style={{ display: 'inline', marginRight: 5 }} />
              Logout
            </button>
          </div>
        </nav>
        <div className="loading-page" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <span className="spinner-text">Loading your interview report...</span>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { label: 'Technical Questions', key: 'technical', icon: <Brain size={16} /> },
    { label: 'Behavioral Questions', key: 'behavioral', icon: <MessageSquare size={16} /> },
    { label: 'Preparation Roadmap', key: 'roadmap', icon: <Map size={16} /> },
  ];

  const renderContent = () => {
    let data = [];
    if (activeTab === 'technical') data = report.technicalQuestions || [];
    if (activeTab === 'behavioral') data = report.behavioralQuestions || [];
    if (activeTab === 'roadmap') data = report.preparationPlan || [];

    if (data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon"><FaBoxOpen style={{ display: "inline", color: "#3b82f6" }} /></div>
          <p className="empty-state-text">No data available for this section.</p>
        </div>
      );
    }

    return data.map((item, index) => {
      // Technical Questions
      if (activeTab === 'technical') {
        return (
          <div key={index} className="question-card">
            <div className="question-badge">
              <Brain size={10} />
              Question {index + 1}
            </div>
            <div className="question-text">{item.question}</div>
            <div className="question-section">
              <div className="question-section-label">Interviewer's Intention</div>
              <div className="question-section-text" style={{ marginBottom: '12px' }}>{item.intention}</div>
              <div className="question-section-label">Expert Answer / Approach</div>
              <div className="question-answer-box">{item.answer}</div>
            </div>
          </div>
        );
      }

      // Behavioral Questions (STAR Format)
      if (activeTab === 'behavioral') {
        return (
          <div key={index} className="question-card">
            <div className="question-badge">
              <MessageSquare size={10} />
              Scenario {index + 1}
            </div>
            <div className="question-text">{item.question}</div>
            <div className="question-section">
              <div className="question-section-label">Intention</div>
              <div className="question-section-text" style={{ marginBottom: '12px' }}>{item.intention}</div>
              <div className="question-section-label">STAR Framework Answer</div>
              <div className="question-answer-box">{item.answer}</div>
            </div>
          </div>
        );
      }

      // Preparation Roadmap
      if (activeTab === 'roadmap') {
        return (
          <div key={index} className="roadmap-card">
            <div className="roadmap-day-badge">
              <FaCalendarAlt style={{ display: "inline", color: "#3b82f6" }} /> Day {item.day}
            </div>
            <div className="roadmap-focus">{item.focusArea}</div>
            <div className="roadmap-tasks">
              {item.tasks && item.tasks.map((task, tIndex) => (
                <div key={tIndex} className="roadmap-task-item">
                  <div className="roadmap-task-dot"></div>
                  {task}
                </div>
              ))}
            </div>
          </div>
        );
      }

      return null;
    });
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  };

  // Calculate circle stroke dashoffset for score
  const score = report.matchScore ?? 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', background: '#f3f4f6', border: '1px solid #e5e7eb',
              borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              color: '#374151', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={15} />
            New Report
          </button>
          <div className="navbar-brand">
            <div className="navbar-brand-icon"><FaBrain style={{ display: "inline", color: "#3b82f6" }} /></div>
            <span className="navbar-brand-name">InterviewAI</span>
          </div>
        </div>
        <div className="navbar-right">
          {user && (
            <div className="navbar-user-info">
              <div className="navbar-avatar">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <span className="navbar-username">{user.name || user.username}</span>
            </div>
          )}
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={14} style={{ display: 'inline', marginRight: 5 }} />
            Logout
          </button>
        </div>
      </nav>

      {/* Interview Layout */}
      <div className="interview-layout">
        {/* Sidebar */}
        <aside className="interview-sidebar">
          <div className="sidebar-section-title">Sections</div>

          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}
            >
              <span className="sidebar-btn-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-section-title" style={{ marginTop: '8px' }}>Report Info</div>
          <div style={{ padding: '12px', background: '#faf5ff', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px' }}>ROLE</div>
            <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600, lineHeight: 1.4 }}>
              {report.title || 'Interview Assessment'}
            </div>
          </div>
       <div className="sidebar-section-title" style={{ marginTop: '8px' }}>My Recent Interview Plans</div>
     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  {reports && reports.length > 0 && reports.map(report => (
    <div 
      key={report._id} 
      onClick={() => navigate(`/interview/${report._id}`)}
      style={{ padding: '12px', background: '#faf5ff', borderRadius: '12px', border: '1px solid #e9d5ff', cursor: 'pointer' }}
    >
      <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600, lineHeight: 1.4 }}>
        {report.title || 'Untitled Position'}
      </div>
      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
        Generated on {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
      </div>
      {report.matchScore !== undefined && (
        <div style={{ fontSize: '11px', color: '#db2777', fontWeight: 600, marginTop: '4px' }}>
          Match Score: {report.matchScore}%
        </div>
      )}
    </div>
  ))}
</div>
        </aside>

        {/* Main Content */}
        <main className="interview-main">
          <div className="interview-header">
            <div className="interview-breadcrumb">
              {report.title || 'Role Interview Assessment'}
            </div>
            <h1 className="interview-page-title">
              {activeTab === 'roadmap'
                ? '14-Day Preparation Roadmap'
                : activeTab === 'technical'
                  ? <><span>Technical</span> Interview Questions</>
                  : <><span>Behavioral</span> Interview Questions</>
              }
            </h1>
          </div>

          <div className="interview-content-grid">
            {/* Questions/Roadmap */}
            <div>
              {renderContent()}
            </div>

            {/* Right Stats */}
            <div className="stats-sidebar">
              {/* Match Score */}
              <div className="score-card">
                <div className="score-card-title">Match Score</div>
                <div className="score-circle-wrapper">
                  <svg width="110" height="110" className="score-circle-svg">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7e22ce" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="score-circle-bg"
                      cx="55"
                      cy="55"
                      r={radius}
                    />
                    <circle
                      className="score-circle-fill"
                      cx="55"
                      cy="55"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="score-circle-text">
                    <span className="score-number">{score}</span>
                    <span className="score-percent">%</span>
                  </div>
                </div>
                <div className="score-label">
                  {score >= 80
                    ? ' Strong match!'
                    : score >= 60
                      ? 'Good match'
                      : 'Keep preparing'}
                </div>
              </div>

              {/* Skill Gaps */}
              <div className="skill-gaps-card">
                <div className="skill-gaps-title">
                  <Zap size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Skill Gaps
                </div>
                {report.skillGaps && report.skillGaps.length > 0 ? (
                  report.skillGaps.map((gap, index) => (
                    <div
                      key={index}
                      className={`skill-gap-item ${getSeverityClass(gap.severity)}`}
                    >
                      <span>{gap.skill}</span>
                      <span className="severity-badge">{gap.severity}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
                    No major skill gaps identified. <FaTrophy style={{ display: "inline", color: "#f97316" }} />
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Interview;