import Accommodation from "../../../models/Accommodation";
import { verifyToken, isAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const accommodation = await Accommodation.findByPk(id);

      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }

      res.status(200).json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accommodation", error: error.message });
    }
  } else if (req.method === "PUT" || req.method === "DELETE") {
    await verifyToken(req, res, async () => {
      await isAdmin(req, res, async () => {
        try {
          const accommodation = await Accommodation.findByPk(id);

          if (!accommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
          }

          if (req.method === "PUT") {
            const { name, ranking, location, officialWebsite, description, images } = req.body;

            await accommodation.update({
              name,
              ranking,
              location,
              officialWebsite,
              description,
              images,
            });

            return res.status(200).json(accommodation);
          } else if (req.method === "DELETE") {
            await accommodation.destroy();
            return res.status(204).end();
          }
        } catch (error) {
          res.status(500).json({ message: `Error ${req.method === "PUT" ? "updating" : "deleting"} accommodation`, error: error.message });
        }
      });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
