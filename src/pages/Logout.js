// LogoutProvider.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here, such as clearing user session
    console.log("User logged out"); // Placeholder for logout logic
    navigate('/', { replace: true }); // Redirect to login page
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { handleLogout })
      )}
    </>
  );
};

export default LogoutProvider;
