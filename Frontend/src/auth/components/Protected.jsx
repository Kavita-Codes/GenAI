import {useAuth} from '../hooks/useAuth';
import {useNavigate} from 'react-router-dom';

const Protected = ({children}) => {
  const {loading, user} = useAuth();
  const navigate = useNavigate();

  if(loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">

            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>

            <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </main>
    );
  }


  if (!user) {
    navigate('/login');
  }

  return children;

}

export default Protected

// wrap by this component to protect any page from unauthenticated users. If user is not authenticated, it will redirect to login page.