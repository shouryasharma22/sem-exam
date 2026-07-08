import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSignature = async () => {
      let currentToken = localStorage.getItem('admin_token');

      // 🌟 If no token exists in storage, challenge the user immediately via URL entry
      if (!currentToken) {
        const tokenInput = prompt("🔒 Access Denied: Enter Administrative Signature to clear security gate:");
        if (tokenInput) {
          localStorage.setItem('admin_token', tokenInput);
          currentToken = tokenInput;
        } else {
          // If they hit cancel or type nothing, instantly boot them back to the home page
          navigate('/', { replace: true });
          return;
        }
      }

      try {
        setIsChecking(true);
        const response = await fetch('http://localhost:8000/api/v1/admin/verify', {
          method: 'POST',
          headers: { 'x-admin-token': currentToken }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setIsAuthorized(true);
        } else {
          // Token inside storage was invalid or fake
          alert("Invalid Administrative Signature. Evicting session node.");
          localStorage.removeItem('admin_token');
          setIsAuthorized(false);
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Auth sync error:', err);
        setIsAuthorized(false);
        navigate('/', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    verifyAdminSignature();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center py-24 bg-[#0B0F19] min-h-screen">
        <p className="text-blue-500 font-mono text-sm animate-pulse">Running autonomous route challenge verification...</p>
      </div>
    );
  }

  // 🎉 Complete Match. Render AdminPortal seamlessly.
  return isAuthorized ? children : null;
}