// Buat file pages/api/sync.js untuk menjalankan migrasi

import sequelize from "../../lib/sequelize";
import User from "../../models/User"; // Import semua model
import Place from "../../models/Place";
import Review from "../../models/Review";
import TicketInfo from "../../models/TicketInfo";
import News from "../../models/News";
import Accommodation from "../../models/Accommodation";

export default async function handler(req, res) {
  try {
    await sequelize.sync({ force: true }); // `force: true` akan menghapus tabel jika ada dan membuat ulang
    res.status(200).json({ message: "Database synchronized" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
