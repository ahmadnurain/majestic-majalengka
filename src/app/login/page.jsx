"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Periksa role dari token dan redirect ke halaman yang sesuai
        if (data.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
