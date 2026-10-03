import React, { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = () =>
    api.get("/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        const body = err.response?.data;
        setError((body && (body.error || Object.values(body)[0])) || "Failed to load orders");
      });

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status?status=${status}`);
    loadOrders();
  };

  return (
    <div className="page">
      <h2>All Orders</h2>
      {error && <p className="error">{error}</p>}
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <p><strong>Order #{order.id}</strong> — {order.userName} ({order.userEmail})</p>
          <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} × {item.quantity} — ${item.priceAtPurchase}
              </li>
            ))}
          </ul>
          <p><strong>Total: ${order.totalAmount}</strong></p>
          <label>
            Status:{" "}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}
