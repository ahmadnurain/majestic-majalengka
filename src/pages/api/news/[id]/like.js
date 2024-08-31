// src/pages/api/news/[id]/like.js

import News from "../../../../models/News"; // Sesuaikan path sesuai struktur proyek Anda
import { verifyToken } from "../../../../lib/auth"; // Jika Anda menggunakan autentikasi

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    try {
      // Cari berita berdasarkan ID
      const news = await News.findByPk(id);
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      // Tambah jumlah likes
      news.likes += 1;
      await news.save();

      return res.status(200).json({ likes: news.likes });
    } catch (error) {
      console.error("Error updating likes:", error);
      return res.status(500).json({ message: "Failed to update likes", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
