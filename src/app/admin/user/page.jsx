"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State untuk mengelola tampilan modal
  const [selectedUser, setSelectedUser] = useState(null); // State untuk menyimpan data user yang sedang diedit
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user); // Set user yang sedang diedit
    setShowModal(true); // Tampilkan modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
      });

      if (response.ok) {
        setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
        handleCloseModal(); // Tutup modal setelah berhasil update
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">All Users</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/admin/user/newuser")} // Arahkan ke halaman tambah user baru
          >
            + Add User
          </button>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">EMAIL</th>
                <th className="px-4 py-2">ROLE</th>
                <th className="px-4 py-2">PHONE NUMBER</th>
                <th className="px-4 py-2">ADDRESS</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.phonenumber}</td>
                    <td className="px-4 py-2">{user.address}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FaEdit className="h-5 w-5 mr-1" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FaTrashAlt className="h-5 w-5 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk Edit User */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input type="text" id="name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input type="email" id="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select id="role" value={selectedUser.role} onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phonenumber"
                  value={selectedUser.phonenumber}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phonenumber: e.target.value })}
                  required
                  className="mt-1 p-2 block w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input type="text" id="address" value={selectedUser.address} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-black px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
