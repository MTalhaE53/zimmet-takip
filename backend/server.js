const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

const productRoutes = require("./routes/products");
const assignmentRoutes = require("./routes/assignments");

const PORT = process.env.PORT || 5000;

// Orta katmanlar
app.use(cors());
app.use(express.json());

// Yüklenen görselleri erişilebilir yap
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API rotaları
app.use("/api/products", productRoutes);
app.use("/api/assignments", assignmentRoutes);

// Sağlık testi endpoint’i (Render test edebilir)
app.get("/", (req, res) => {
  res.send("Zimmet Takip API çalışıyor 🚀");
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
