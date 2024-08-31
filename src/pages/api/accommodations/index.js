import Accommodation from "../../../models/Accommodation";
import { verifyToken, isAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await verifyToken(req, res, async () => {
      await isAdmin(req, res, async () => {
        const { name, ranking, location, officialWebsite, description, images } = req.body;

        try {
          const accommodation = await Accommodation.create({
            name,
            ranking,
            location,
            officialWebsite,
            description,
            images, // Array URL gambar
          });

          res.status(201).json(accommodation);
        } catch (error) {
          res.status(500).json({ message: "Error creating accommodation", error: error.message });
        }
      });
    });
  } else if (req.method === "GET") {
    // Endpoint untuk mendapatkan semua akomodasi yang dapat diakses tanpa login
    try {
      const accommodations = await Accommodation.findAll();
      res.status(200).json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accommodations", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
