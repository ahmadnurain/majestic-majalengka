import fs from "fs";
import path from "path";
import formidable from "formidable";
import Place from "../../../models/Place";
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
          multiples: true, // Mengizinkan banyak file
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Terjadi kesalahan saat upload file:", err);
            return res.status(500).json({ message: "Terjadi kesalahan saat mengunggah file", error: err.message });
          }

          // Parsing data fields
          const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
          const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
          const rating = parseFloat(Array.isArray(fields.rating) ? fields.rating[0] : fields.rating);
          const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
          const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
          const maps = Array.isArray(fields.maps) ? fields.maps[0] : fields.maps;

          let socialMedia = Array.isArray(fields.socialMedia) ? fields.socialMedia[0] : fields.socialMedia;
          try {
            socialMedia = JSON.parse(socialMedia);
          } catch (error) {
            console.warn("socialMedia tidak dalam format JSON, menggunakan nilai string asli.");
            socialMedia = [socialMedia]; // Tetap gunakan sebagai array
          }

          // Operational hours as JSON
          const operationalHours = {
            open: Array.isArray(fields.openTime) ? fields.openTime[0] : fields.openTime,
            close: Array.isArray(fields.closeTime) ? fields.closeTime[0] : fields.closeTime,
          };

          // Proses penyimpanan banyak file gambar
          let filePaths = [];
          if (files.file && !Array.isArray(files.file)) {
            files.file = [files.file]; // Ubah menjadi array jika hanya satu file
          }

          if (files.file) {
            filePaths = files.file.map((file) => {
              const filePath = path.join("/uploads", file.newFilename).replace(/\\/g, "/");
              return filePath;
            });
          }

          // Debugging
          console.log("Files received:", files);
          console.log("Final File Paths:", filePaths);

          if (filePaths.length === 0) {
            console.error("File paths array is empty. No files were processed.");
            return res.status(500).json({ message: "No files were processed." });
          }

          try {
            // Membuat entri tempat di database
            const newPlace = await Place.create({
              name,
              description,
              rating,
              address,
              type,
              operationalHours,
              maps,
              socialMedia, // Simpan socialMedia sebagai array
              images: filePaths, // Simpan array URL gambar secara langsung
            });

            console.log("Place Created:", newPlace); // Debugging
            res.status(201).json(newPlace);
          } catch (error) {
            console.error("Terjadi kesalahan saat membuat tempat:", error);
            res.status(500).json({ message: "Terjadi kesalahan saat membuat tempat", error: error.message });
          }
        });
      });
    });
  } else if (req.method === "GET") {
    try {
      const places = await Place.findAll();
      res.status(200).json(places);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil tempat", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Metode tidak diizinkan" });
  }
}
