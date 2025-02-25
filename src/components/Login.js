// components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/login.css";
import { find, specificLoadingProcess } from "../firebase/helper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../state/globalsSlice";
import { timestampToStringConverter } from "../helpers/TimestampToStringConverter";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "admin@admin.com",
    password: "password",
  });
  const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.globals.specificLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add your forgot password logic here
    console.log("Forgot password clicked");
  };

  const handleSubmit = async (e) => {
    specificLoadingProcess(
      async () => {
        e.preventDefault();
        setError("");

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await signInWithEmailAndPassword(
          auth,
          credentials.username,
          credentials.password
        );

        const userDoc = await find("users", result.user.uid);

        if (!userDoc.exists()) {
          await auth.signOut();
          setError("Account not found");
          return;
        }

        const userData = userDoc.data();

        // Verify user type
        if (userData.role != "Admin") {
          await auth.signOut();
          setError("Incorrect credentials");
          return;
        }

        // Check account status
        if (!userData.active) {
          await auth.signOut();
          setError("Account is not active");
          return;
        }

        dispatch(
          setUser({
            id: result.user.uid,
            name: userData.name,
            email: userData.email,
            image: userData.image,
          })
        );

        localStorage.setItem("userToken", "demo-token");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: "John Doe",
            role: "Admin",
          })
        );

        navigate("/admin/home", { replace: true });
      },
      (error) => {
        let errorMessage = "An error occurred during login";

        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later";
            break;
          case "auth/invalid-credential":
            errorMessage = "Incorrect credentials";
            break;
          default:
            errorMessage = error.message;
        }

        setError(errorMessage);
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-content">
            <div className="login-header">
              <div className="logo-container">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png"
                  alt="ServicePro Logo"
                  className="logo"
                />
              </div>
              <h1>Welcome Back!</h1>
              <p>Please sign in to continue</p>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label>Username</label>
                <div className="input-container">
                  <FaUser className="field-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Password</label>
                <div className="input-container">
                  <FaLock className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  onClick={handleForgotPassword}
                  className="forgot-password-btn"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className={`login-button ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
