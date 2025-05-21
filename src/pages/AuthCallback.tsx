
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error handling auth callback:', error);
          navigate('/login', { replace: true });
        } else {
          // Get the intended destination or default to home
          const from = sessionStorage.getItem('authRedirect') || '/';
          sessionStorage.removeItem('authRedirect');
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Processing authentication...</h2>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
    </div>
  );
};

export default AuthCallback;
