const express = require("express");
const router = express.Router();
const pool = require("../db");

// Zimmet kaydı
router.post("/", async (req, res) => {
  const { product_id, user_name, assigned_date } = req.body;

  try {
    // 1. Kullanıcıyı bul ya da ekle (şimdilik isimle manuel)
    let user = await pool.query("SELECT id FROM users WHERE name = $1", [user_name]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
        [user_name, `${Date.now()}@placeholder.com`]
      );
    }

    const user_id = user.rows[0].id;

    // 2. Zimmet kaydını ekle
    await pool.query(
      "INSERT INTO assignments (product_id, user_id, assigned_date) VALUES ($1, $2, $3)",
      [product_id, user_id, assigned_date]
    );

    // 3. Ürünün status'ünü 'zimmetli' yap
    await pool.query("UPDATE products SET status = 'zimmetli' WHERE id = $1", [product_id]);

    res.status(201).json({ message: "Zimmet başarıyla eklendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zimmet eklenemedi" });
  }
});
router.delete("/remove/:product_id", async (req, res) => {
  const { product_id } = req.params;
  try {
    await pool.query("DELETE FROM assignments WHERE product_id = $1", [product_id]);
    await pool.query("UPDATE products SET status = 'stokta' WHERE id = $1", [product_id]);
    res.json({ message: "Zimmet kaldırıldı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zimmet silinemedi" });
  }
});
router.get("/product/:product_id", async (req, res) => {
  const { product_id } = req.params;

  try {
    const result = await pool.query(`
      SELECT assignments.*, users.name AS user_name
      FROM assignments
      JOIN users ON assignments.user_id = users.id
      WHERE product_id = $1
    `, [product_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Zimmet bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zimmet bilgisi alınamadı" });
  }
});
router.put("/update/:product_id", async (req, res) => {
  const { product_id } = req.params;
  const { user_name, assigned_date } = req.body;

  try {
    // kullanıcı varsa ID’sini al, yoksa ekle
    let user = await pool.query("SELECT id FROM users WHERE name = $1", [user_name]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
        [user_name, `${Date.now()}@placeholder.com`]
      );
    }

    const user_id = user.rows[0].id;

    // zimmeti güncelle
    await pool.query(
      "UPDATE assignments SET user_id = $1, assigned_date = $2 WHERE product_id = $3",
      [user_id, assigned_date, product_id]
    );

    res.json({ message: "Zimmet güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zimmet güncellenemedi" });
  }
});

module.exports = router;
