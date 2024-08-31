// src/pages/api/auth/logout.js

import cookie from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Hapus token dengan mengatur maxAge menjadi 0
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Menghapus cookie dengan mengatur umur menjadi 0
      })
    );

    return res.status(200).json({ message: "Logout successful" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
