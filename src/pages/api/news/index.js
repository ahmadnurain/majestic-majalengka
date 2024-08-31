// pages/api/news/index.js
import fs from "fs";
import path from "path";
import formidable from "formidable";
import News from "../../../models/News";
import { verifyToken, isAdmin } from "../../../lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    await verifyToken(req, res, async () => {
      await isAdmin(req, res, async () => {
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Pastikan direktori upload ada
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
          uploadDir: uploadDir,
          keepExtensions: true,
          maxFileSize: 10 * 1024 * 1024, // Batas ukuran file 10MB
          multiples: false, // Mengharapkan satu file
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Terjadi kesalahan saat upload file:", err);
            return res.status(500).json({ message: "Terjadi kesalahan saat mengunggah file", error: err.message });
          }

          // Pastikan field-field adalah string
          const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
          const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
          const sourceLink = Array.isArray(fields.sourceLink) ? fields.sourceLink[0] : fields.sourceLink;

          const file = files.file && files.file[0]; // Ambil elemen pertama dari array files.file
          let filePath = null;

          // Cek apakah file ada dan berhasil diunggah
          if (file && file.newFilename) {
            filePath = path.join("/uploads", file.newFilename);
            console.log("File Path:", filePath); // Logging file path untuk debugging
          }

          try {
            const authorName = req.user.name || "Unknown"; // Mengambil nama penulis dari token yang telah diverifikasi

            // Membuat entri berita di database
            const news = await News.create({
              title: title || "",
              content: content || "",
              imageUrl: filePath, // Menyimpan path URL gambar
              sourceLink: sourceLink || "",
              authorName,
              userId: req.user.id,
            });

            res.status(201).json(news);
          } catch (error) {
            console.error("Terjadi kesalahan saat membuat berita:", error);
            res.status(500).json({ message: "Terjadi kesalahan saat membuat berita", error: error.message });
          }
        });
      });
    });
  } else if (req.method === "GET") {
    try {
      const news = await News.findAll();
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil berita", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Metode tidak diizinkan" });
  }
}
