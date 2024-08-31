import User from "../../../models/User";
import { verifyToken, isAdmin } from "../../../lib/auth";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    await verifyToken(req, res, async () => {
      await isAdmin(req, res, async () => {
        const { id } = req.query;

        if (req.method === "GET") {
          try {
            const user = await User.findByPk(id);
            if (!user) {
              console.error(`User with ID ${id} not found`);
              return res.status(404).json({ message: "User not found" });
            }
            console.log("User retrieved:", user.dataValues);
            return res.status(200).json(user);
          } catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).json({ message: "Failed to retrieve user" });
          }
        }

        if (req.method === "PUT") {
          const { role, name, email, password, phonenumber, address } = req.body;

          if (!name || !email || !phonenumber || !address) {
            console.error("Missing required fields");
            return res.status(400).json({ message: "Name, email, phone number, and address are required" });
          }

          try {
            const user = await User.findByPk(id);
            if (!user) {
              console.error(`User with ID ${id} not found`);
              return res.status(404).json({ message: "User not found" });
            }

            user.name = name;
            user.email = email;
            user.role = role || user.role;
            user.phonenumber = phonenumber;
            user.address = address;

            if (password) {
              user.password = await bcrypt.hash(password, 10);
            }

            await user.save();

            console.log("User updated:", user.dataValues);
            return res.status(200).json(user);
          } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: "An error occurred while updating the user" });
          }
        }

        if (req.method === "DELETE") {
          try {
            const userToDelete = await User.findByPk(id);
            if (!userToDelete) {
              console.error(`User with ID ${id} not found`);
              return res.status(404).json({ message: "User not found" });
            }
            await User.destroy({ where: { id } });
            console.log("User deleted:", userToDelete.dataValues);
            return res.status(204).end();
          } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Failed to delete user" });
          }
        }

        console.error("Method not allowed");
        return res.status(405).json({ message: "Method not allowed" });
      });
    });
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "Authorization error" });
  }
}
