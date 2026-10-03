import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      navigate(data.role === "ADMIN" ? "/admin/products" : "/");
    } catch (err) {
      if (err.response) {
        const body = err.response.data;
        const message =
          (body && (body.error || Object.values(body)[0])) ||
          `Server returned ${err.response.status}`;
        setError(message);
      } else if (err.request) {
        setError(
          "No response from server. Is the backend running on http://localhost:8080, " +
          "and does its CORS config allow this page's origin (" + window.location.origin + ")?"
        );
      } else {
        setError("Request failed: " + err.message);
      }
    }
  };

  return (
    <div className="form-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
