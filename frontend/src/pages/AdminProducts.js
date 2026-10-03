import React, { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", stock: "", imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () => api.get("/products").then((res) => setProducts(res.data));

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
    });
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete product");
    }
  };

  return (
    <div className="page">
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}