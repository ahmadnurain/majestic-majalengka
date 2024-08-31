// pages/api/users/index.js
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await User.findAll(); // Ambil semua user dari database
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
