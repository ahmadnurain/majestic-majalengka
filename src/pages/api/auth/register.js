import bcrypt from "bcryptjs";
import User from "../../../models/User";
import sequelize from "../../../lib/sequelize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, role, phonenumber, address } = req.body;

    try {
      // Cek apakah user sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password sebelum menyimpan ke database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user ke database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default role 'user' jika tidak ada
        phonenumber,
        address,
      });

      return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error registering user" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
