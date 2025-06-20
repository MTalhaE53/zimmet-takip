const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const productRoutes = require("./routes/products");
const assignmentRoutes = require("./routes/assignments");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes); // 👈 Ekledik

app.use("/api/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.send("Zimmet Takip API çalışıyor 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
