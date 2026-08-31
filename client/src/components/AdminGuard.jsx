import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const RESOURCE_URL = `${API_BASE_URL}/resources`;
const ADMIN_URL = `${API_BASE_URL}/admin`;
const ADMIN_UPLOAD_URL = `${ADMIN_URL}/upload`;
const ADMIN_DELETE_URL = `${ADMIN_URL}/resources`;


export default function AdminGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSignature = async () => {
      let currentToken = localStorage.getItem('admin_token');

      if (!currentToken) {
        const tokenInput = prompt("🔒 Access Denied: Enter Administrative Signature to clear security gate:");
        if (tokenInput) {
          localStorage.setItem('admin_token', tokenInput);
          currentToken = tokenInput;
        } else {
          navigate('/', { replace: true });
          return;
        }
      }

      try {
        setIsChecking(true);
        const response = await fetch(`${ADMIN_URL}/verify`, {
          method: 'POST',
          headers: { 'x-admin-token': currentToken }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setIsAuthorized(true);
        } else {
          // Token inside storage was invalid or fake
          alert("Invalid Administrative Signature");
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
    //if navigation function ever changes, re-run the process to make sure we have the latest navigation function (very rare case)
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center py-24 bg-[#FFFFFF] min-h-screen">
        <p className="text-blue-500 font-mono text-sm animate-pulse">Verifying admin token....</p>
      </div>
    );
  }

  return isAuthorized ? children : null;
  //children is whatever component we wrap inside the <AdminGuard> component . if isauthorized, show the wrapped component.
}