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
  await verifyToken(req, res, async () => {
    await isAdmin(req, res, async () => {
      const { id } = req.query;

      if (req.method === "GET") {
        try {
          const place = await Place.findByPk(id);
          if (!place) {
            return res.status(404).json({ message: "Place not found" });
          }
          return res.status(200).json(place);
        } catch (error) {
          console.error("Error fetching place:", error);
          return res.status(500).json({ message: "Error fetching place", error: error.message });
        }
      }

      if (req.method === "PUT") {
        const uploadDir = path.join(process.cwd(), "public/uploads");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = formidable({
          uploadDir: uploadDir,
          keepExtensions: true,
          maxFileSize: 10 * 1024 * 1024, // 10MB file size limit
          multiples: true,
          allowEmptyFiles: true, // Allow empty files to prevent errors when no file is uploaded
          minFileSize: 0, // Allow file size of 0 bytes to avoid errors with empty files
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).json({ message: "File upload error", error: err.message });
          }

          const place = await Place.findByPk(id);
          if (!place) {
            return res.status(404).json({ message: "Place not found" });
          }

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
            socialMedia = [socialMedia];
          }

          const operationalHours = {
            open: Array.isArray(fields.openTime) ? fields.openTime[0] : fields.openTime,
            close: Array.isArray(fields.closeTime) ? fields.closeTime[0] : fields.closeTime,
          };

          // If no new files are uploaded, retain the existing file paths
          let filePaths = place.images;
          if (files.file && Array.isArray(files.file) && files.file.some((file) => file.size > 0)) {
            filePaths = files.file.map((file) => {
              const filePath = path.join("/uploads", file.newFilename).replace(/\\/g, "/");
              return filePath;
            });
          }

          try {
            await place.update({
              name,
              description,
              rating,
              address,
              type,
              operationalHours,
              maps,
              socialMedia,
              images: filePaths, // Update with the new paths or retain old ones
            });

            res.status(200).json(place);
          } catch (error) {
            console.error("Error updating place:", error);
            res.status(500).json({ message: "Error updating place", error: error.message });
          }
        });
      }

      if (req.method === "DELETE") {
        try {
          const place = await Place.findByPk(id);
          if (!place) {
            return res.status(404).json({ message: "Place not found" });
          }

          // Ensure we have an array before trying to loop over images
          if (Array.isArray(place.images)) {
            place.images.forEach((imagePath) => {
              const filePath = path.join(process.cwd(), "public", imagePath);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          }

          await Place.destroy({ where: { id } });
          return res.status(204).end();
        } catch (error) {
          console.error("Error deleting place:", error);
          return res.status(500).json({ message: "Error deleting place", error: error.message });
        }
      }

      return res.status(405).json({ message: "Method not allowed" });
    });
  });
}
