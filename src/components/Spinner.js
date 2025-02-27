import React from "react";

export default function Spinner({size = "40px"}) {
  const spinnerStyle = {
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #3498db",
    borderRight: "4px solid #3498db",
    borderRadius: "50%",
    width: size,
    height: size,
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
      <div style={spinnerStyle}></div>
    </div>
  );
}
