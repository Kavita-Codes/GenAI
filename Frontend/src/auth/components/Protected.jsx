import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after loading is done and user is still null
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <span className="spinner-text">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  // Don't render children while redirecting
  if (!user) return null;

  return children;
};

export default Protected;

// wrap by this component to protect any page from unauthenticated users. If user is not authenticated, it will redirect to login page.