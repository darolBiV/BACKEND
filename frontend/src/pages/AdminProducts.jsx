import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";
import "./AdminProducts.css";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  rating: "",
  images: "",
  stock_quantity: "",
};

function AdminProducts() {
  const { token, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/products?page=1&limit=100&sort_by=title&order=asc`,
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message ?? "Failed to load products");
      setProducts(data.items);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadProducts();
    else setIsLoading(false);
  }, [isAdmin, loadProducts]);

  if (!isAuthenticated) {
    return <main className="admin-page"><h1>Sign in to access administration</h1></main>;
  }

  if (!isAdmin) {
    return <main className="admin-page"><h1>Administrator access required</h1></main>;
  }

  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      rating: String(product.rating),
      images: product.images.join("\n"),
      stock_quantity: String(product.stock_quantity),
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      rating: Number(form.rating),
      images: form.images.split(/\r?\n|,/).map((url) => url.trim()).filter(Boolean),
      stock_quantity: Number(form.stock_quantity),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/products${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.message ?? "Failed to save product");
      setMessage(editingId ? "Product updated" : "Product created");
      resetForm();
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage("");
    setError("");

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/products/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.message ?? "Failed to upload image");
      setForm((current) => ({
        ...current,
        images: current.images ? `${current.images}\n${result.url}` : result.url,
      }));
      setMessage("Image uploaded to Supabase Storage");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.title}?`)) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to delete product");
      }

      if (editingId === product.id) resetForm();
      setMessage("Product deleted");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="admin-page">
      <h1>Product administration</h1>
      <p>Create, edit and delete catalog products.</p>

      <form className="admin-form" onSubmit={submitProduct}>
        <h2>{editingId ? `Edit product #${editingId}` : "Create product"}</h2>
        <label>Title<input name="title" value={form.title} onChange={changeField} required /></label>
        <label>Description<textarea name="description" value={form.description} onChange={changeField} required /></label>
        <div className="admin-form-row">
          <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={changeField} required /></label>
          <label>Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={changeField} required /></label>
          <label>Stock<input name="stock_quantity" type="number" min="0" step="1" value={form.stock_quantity} onChange={changeField} required /></label>
        </div>
        <label>Image URLs, at least three<textarea name="images" value={form.images} onChange={changeField} placeholder="One URL per line" required /></label>
        <label className="admin-upload">
          Upload image to Supabase Storage
          <input type="file" accept="image/*" onChange={uploadImage} disabled={isUploading} />
          <span>{isUploading ? "Uploading..." : "The returned URL will be added above"}</span>
        </label>
        <div className="admin-form-actions">
          <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}</button>
          {editingId && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {message && <p className="admin-message success">{message}</p>}
      {error && <p className="admin-message error">{error}</p>}

      <section className="admin-products">
        <h2>Products</h2>
        {isLoading && <p>Loading products...</p>}
        {!isLoading && products.map((product) => (
          <article className="admin-product" key={product.id}>
            <img src={product.images[0]} alt="" />
            <div>
              <strong>{product.title}</strong>
              <span>${product.price} · stock {product.stock_quantity}</span>
            </div>
            <button type="button" onClick={() => editProduct(product)}>Edit</button>
            <button type="button" className="danger" onClick={() => deleteProduct(product)}>Delete</button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminProducts;
