import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CustomerShop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const updateQty = (productId, qty) => {
    setCart((prev) => ({ ...prev, [productId]: qty }));
  };

  const placeOrder = async () => {
    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId: Number(productId), quantity: Number(quantity) }));

    if (items.length === 0) {
      setMessage("Add a quantity to at least one product first.");
      return;
    }

    try {
      await api.post("/orders", { items });
      setMessage("Order placed successfully!");
      setCart({});
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to place order");
    }
  };

  return (
    <div className="page">
      <h2>Shop</h2>
      {message && <p className="notice">{message}</p>}
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>${p.price}</strong> — {p.stock} in stock</p>
            {user && user.role === "CUSTOMER" && (
              <input
                type="number"
                min="0"
                max={p.stock}
                placeholder="Qty"
                value={cart[p.id] || ""}
                onChange={(e) => updateQty(p.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {user && user.role === "CUSTOMER" && (
        <button onClick={placeOrder}>Place Order</button>
      )}
    </div>
  );
}
