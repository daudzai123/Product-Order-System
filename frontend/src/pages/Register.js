import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await register(name, email, password, role);
      navigate(data.role === "ADMIN" ? "/admin/products" : "/");
    } catch (err) {
      // Show the real cause on-screen, so this is diagnosable without DevTools.
      if (err.response) {
        // Backend responded, but with an error status.
        const body = err.response.data;
        const message =
          (body && (body.error || Object.values(body)[0])) ||
          `Server returned ${err.response.status}`;
        setError(message);
      } else if (err.request) {
        // Request was sent but no response ever came back — almost always
        // CORS or the backend not running/reachable on this origin.
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name}
               onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin (dev/testing only)</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
