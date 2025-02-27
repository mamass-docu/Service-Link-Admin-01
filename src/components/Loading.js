import React from "react";

const Loading = () => {
  const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const spinnerStyle = {
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  };

  // Keyframes for the spinner animation
  const keyframes = `
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `;

  return (
    <div>
      <style>{keyframes}</style>
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </div>
  );
};

export default Loading;
