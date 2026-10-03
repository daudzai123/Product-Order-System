import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        const body = err.response?.data;
        setError((body && (body.error || Object.values(body)[0])) || "Failed to load orders");
      });
  }, []);

  return (
    <div className="page">
      <h2>My Orders</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && !error && <p>No orders yet.</p>}
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <p><strong>Order #{order.id}</strong> — {order.status}</p>
          <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} × {item.quantity} — ${item.priceAtPurchase}
              </li>
            ))}
          </ul>
          <p><strong>Total: ${order.totalAmount}</strong></p>
        </div>
      ))}
    </div>
  );
}
