import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Buat direktori upload jika belum ada
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  let filePath = null;

  form.on("file", (name, file) => {
    filePath = path.join("/uploads", path.basename(file.filepath || file.newFilename));
  });

  form.on("end", () => {
    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded or file path is undefined" });
    }
    res.status(200).json({ filePath });
  });

  form.on("error", (err) => {
    console.error("Error during file upload:", err);
    return res.status(500).json({ message: "Error uploading file", error: err.message });
  });

  form.parse(req);
}
