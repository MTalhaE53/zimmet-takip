// frontend/src/pages/AssignProduct.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AssignProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    user_name: "",
    assigned_date: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("product");

    if (productId) {
      setForm((prev) => ({ ...prev, product_id: productId }));

      // Zimmetli mi kontrol et → varsa formu doldur
      axios
        .get(`http://zimmet-api.onrender.com/api/assignments/product/${productId}`)
        .then((res) => {
          setForm({
            product_id: productId,
            user_name: res.data.user_name,
            assigned_date: res.data.assigned_date.split("T")[0], // YYYY-MM-DD
          });
          setIsUpdate(true);
        })
        .catch(() => {
          setIsUpdate(false); // zimmet yoksa yeni kayıt yapılacak
        });
    }

    // ürün listesi getir
    axios.get("http://zimmet-api.onrender.com/api/products").then((res) => {
      setProducts(res.data);
    });
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await axios.put(
          `http://zimmet-api.onrender.com/api/assignments/update/${form.product_id}`,
          form
        );
      } else {
        await axios.post("http://zimmet-api.onrender.com/api/assignments", form);
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Zimmetleme hatası:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isUpdate ? "Zimmeti Güncelle" : "Ürün Zimmetleme"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          disabled
          className="w-full border rounded p-2 bg-gray-100"
        >
          <option value="">Ürün Seç</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.serial_number}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="user_name"
          value={form.user_name}
          onChange={handleChange}
          placeholder="Personel Adı"
          className="w-full border rounded p-2"
          required
        />

        <input
          type="date"
          name="assigned_date"
          value={form.assigned_date}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isUpdate ? "Zimmeti Güncelle" : "Zimmetle"}
        </button>

        {success && (
          <p className="text-green-600">
            ✅ {isUpdate ? "Güncelleme başarılı" : "Zimmet eklendi"}
          </p>
        )}
      </form>
    </div>
  );
};

export default AssignProduct;
