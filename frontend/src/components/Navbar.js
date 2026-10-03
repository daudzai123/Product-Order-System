import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Product Order System</Link>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === "CUSTOMER" && (
          <>
            <Link to="/">Shop</Link>
            <Link to="/my-orders">My Orders</Link>
          </>
        )}
        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin/products">Manage Products</Link>
            <Link to="/admin/orders">All Orders</Link>
          </>
        )}
        {user && (
          <>
            <span className="user-chip">{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
