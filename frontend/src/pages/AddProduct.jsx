// frontend/src/pages/AddProduct.jsx

import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    serial_number: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("serial_number", form.serial_number);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.post("http://localhost:5000/api/products/add", formData);
      setSuccess(true);
      setForm({ name: "", brand: "", serial_number: "", image: null });
    } catch (err) {
      console.error("Hata:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Yeni Ürün Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Marka"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          name="serial_number"
          placeholder="Seri Numarası"
          value={form.serial_number}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Ekleniyor..." : "Ürünü Ekle"}
        </button>
        {success && <p className="text-green-600">✅ Ürün başarıyla eklendi!</p>}
      </form>
    </div>
  );
};

export default AddProduct;
