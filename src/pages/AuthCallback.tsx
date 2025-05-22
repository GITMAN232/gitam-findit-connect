
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This is a mock implementation since we're not using Supabase right now
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Since we're not using real auth for now, just redirect to home
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <p className="text-gray-500">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
