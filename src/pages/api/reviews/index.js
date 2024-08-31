import Review from "../../../models/Review";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  await verifyToken(req, res, async () => {
    if (req.method === "POST") {
      const { rating, comment, placeId } = req.body;
      const review = await Review.create({
        rating,
        comment,
        placeId,
        userId: req.user.id,
      });
      return res.status(201).json(review);
    }

    if (req.method === "GET") {
      const reviews = await Review.findAll();
      return res.status(200).json(reviews);
    }

    return res.status(405).json({ message: "Method not allowed" });
  });
}
