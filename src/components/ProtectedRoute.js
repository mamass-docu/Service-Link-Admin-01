import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  // Here, you could add more checks if needed for roles.
  return children;
};

export default ProtectedRoute;
