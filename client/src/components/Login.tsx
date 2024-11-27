import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../configs/axios";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("password123");

  const navigate = useNavigate();

  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    try {
      // Make API request to login
      const response = await apiClient.post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
        }
      );

      const { accessToken, refreshToken } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      login(accessToken);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>Login</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Login;
