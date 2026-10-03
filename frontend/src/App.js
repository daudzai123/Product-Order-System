import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerShop from "./pages/CustomerShop";
import MyOrders from "./pages/MyOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<CustomerShop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-orders" element={
            <PrivateRoute roles={["CUSTOMER"]}><MyOrders /></PrivateRoute>
          } />

          <Route path="/admin/products" element={
            <PrivateRoute roles={["ADMIN"]}><AdminProducts /></PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute roles={["ADMIN"]}><AdminOrders /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
