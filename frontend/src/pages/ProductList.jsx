import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import QrModal from "../components/QrModal";
import {
  Pencil,
  Trash2,
  QrCode,
  UserX,
  UserCheck,
  ClipboardList,
} from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://zimmet-api.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istiyor musun?")) {
      await axios.delete(`http://zimmet-api.onrender.com/api/products/${id}`);
      fetchProducts();
    }
  };

  const handleZimmetKaldir = async (id) => {
    if (window.confirm("Zimmeti kaldırmak istiyor musun?")) {
      await axios.delete(`http://zimmet-api.onrender.com/api/assignments/remove/${id}`);
      fetchProducts();
    }
  };

  const handleZimmetle = (id) => {
    navigate(`/zimmetle?product=${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList size={20} />
          Ürün Listesi
        </h2>
        <Link
          to="/urun-ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Görsel</th>
              <th className="px-4 py-3">Adı</th>
              <th className="px-4 py-3">Marka</th>
              <th className="px-4 py-3">Seri No</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                {p.image_url ? (
<div className="w-[80px] h-[60px] flex items-center justify-center border rounded overflow-hidden bg-gray-100">
  <img
    src={`http://zimmet-api.onrender.com${p.image_url}`}
    alt={p.name}
    className="w-full h-full object-contain"
  />
</div>
                ) : (
                    "-"
                )}
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.brand}</td>
                <td className="px-4 py-3">{p.serial_number}</td>
                <td className="px-4 py-3">
                  {p.status === "zimmetli" && p.assigned_to ? (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 text-xs rounded">
                      Zimmetli ({p.assigned_to})
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                      Stokta
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 space-x-1 flex flex-wrap gap-1">
                  <Link
                    to={`/urun-duzenle/${p.id}`}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                    title="Düzenle"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => setSelectedProductForQR(p)}
                    className="bg-purple-600 text-white p-1 rounded hover:bg-purple-700"
                    title="QR Göster"
                  >
                    <QrCode size={16} />
                  </button>

                  {p.status === "zimmetli" ? (
                    <>
                      <button
                        onClick={() => handleZimmetKaldir(p.id)}
                        className="bg-gray-700 text-white p-1 rounded hover:bg-gray-800"
                        title="Zimmeti Kaldır"
                      >
                        <UserX size={16} />
                      </button>
                      <button
                        onClick={() => handleZimmetle(p.id)}
                        className="bg-blue-800 text-white p-1 rounded hover:bg-blue-900"
                        title="Zimmeti Güncelle"
                      >
                        <UserCheck size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleZimmetle(p.id)}
                      className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                      title="Zimmetle"
                    >
                      <UserCheck size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProductForQR && (
        <QrModal
          product={selectedProductForQR}
          onClose={() => setSelectedProductForQR(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
