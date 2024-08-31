import News from "../../../models/News";
import { verifyToken, isAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const news = await News.findByPk(id);

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      // Menambahkan jumlah baca setiap kali berita diakses
      await news.increment("reads", { by: 1 });

      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news", error: error.message });
    }
  } else if (req.method === "PUT" || req.method === "DELETE") {
    await verifyToken(req, res, async () => {
      await isAdmin(req, res, async () => {
        try {
          const news = await News.findByPk(id);

          if (!news) {
            return res.status(404).json({ message: "News not found" });
          }

          if (req.method === "PUT") {
            const { title, content, imageUrl, sourceLink } = req.body;

            await news.update({
              title,
              content,
              imageUrl,
              sourceLink,
            });

            return res.status(200).json(news);
          } else if (req.method === "DELETE") {
            await news.destroy();
            return res.status(204).end();
          }
        } catch (error) {
          res.status(500).json({ message: `Error ${req.method === "PUT" ? "updating" : "deleting"} news`, error: error.message });
        }
      });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
