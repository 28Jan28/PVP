const express = require("express");
const cors = require("cors");
const app = express();
const data = require("./data.json");

app.use(cors());

// Endpoint pro vyhledávání dílu
app.get("/search", (req, res) => {
  const partId = req.query.partId;

  if (!partId) {
    return res.status(400).json({ message: "Chybí ID dílu." });
  }

  const parts = data.parts.filter((p) => p.id === partId);

  if (parts.length === 0) {
    return res.status(404).json({ message: "Díl nenalezen." });
  }

  res.json(parts);
});

app.listen(5000, () => {
  console.log("Server běží na http://localhost:5000");
});