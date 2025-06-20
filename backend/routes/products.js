// backend/routes/products.js

const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Resim yükleme ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Yeni ürün ekle
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, brand, serial_number } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, brand, serial_number, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, brand, serial_number, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ürün eklenemedi" });
  }
});

// ✅ Tüm ürünleri listele
router.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ürünler alınamadı' });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.status(200).json({ message: "Ürün silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Silme işlemi başarısız" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ürün getirilemedi" });
  }
});

// Ürün güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, brand, serial_number, status } = req.body;
  try {
    await pool.query(
      "UPDATE products SET name=$1, brand=$2, serial_number=$3, status=$4 WHERE id=$5",
      [name, brand, serial_number, status, id]
    );
    res.json({ message: "Ürün güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});
module.exports = router;
