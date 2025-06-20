import { QRCodeCanvas } from "qrcode.react";

const QrModal = ({ product, onClose }) => {
  const qrUrl = `http://localhost:5173/urun-detay/${product.id}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center w-[320px] max-w-full">
        <h2 className="text-xl font-bold mb-4">{product.name} QR Kodu</h2>

        <div className="flex justify-center">
          <QRCodeCanvas value={qrUrl} size={200} />
        </div>

        <p className="text-sm mt-4 text-gray-600 break-all">{qrUrl}</p>

        <button
          onClick={onClose}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default QrModal;
