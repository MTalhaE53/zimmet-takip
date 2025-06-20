// frontend/src/pages/ProductEdit.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    brand: "",
    serial_number: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ürün detaylarını getir
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Ürün alınamadı:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, form);
      navigate("/"); // Listeye geri dön
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ürünü Düzenle</h1>
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
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="stokta">Stokta</option>
          <option value="zimmetli">Zimmetli</option>
          <option value="bakımda">Bakımda</option>
          <option value="kayıp">Kayıp</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Güncelleniyor..." : "Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
