import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://zimmet-api.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Ürün alınamadı:", err));
  }, [id]);

  if (!product) return <p className="text-center text-gray-500">Yükleniyor...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Ürün Detayı</h1>

      {product.image_url && (
        <img
          src={`http://zimmet-api.onrender.com${product.image_url}`}
          alt={product.name}
          className="w-full h-60 object-contain rounded mb-4 border"
        />
      )}

      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <strong>Adı:</strong> {product.name}
        </div>
        <div>
          <strong>Marka:</strong> {product.brand}
        </div>
        <div>
          <strong>Seri No:</strong> {product.serial_number}
        </div>
        <div>
          <strong>Durum:</strong>{" "}
          {product.status === "zimmetli" && product.assigned_to ? (
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
              Zimmetli ({product.assigned_to})
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              Stokta
            </span>
          )}
        </div>
        {product.assignment_date && (
          <div>
            <strong>Zimmet Tarihi:</strong> {new Date(product.assignment_date).toLocaleDateString("tr-TR")}
          </div>
        )}
        {product.note && (
          <div>
            <strong>Not:</strong> {product.note}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
