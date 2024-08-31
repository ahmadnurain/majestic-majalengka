// pages/api/auth/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name }, // Sertakan nama pengguna dalam payload
        "your-very-strong-secret-key-1234567890",
        { expiresIn: "1h" }
      );

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        })
      );

      return res.status(200).json({ message: "Login successful", role: user.role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error logging in" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
