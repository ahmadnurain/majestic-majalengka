"use client";

import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Dashboard() {
  const products = [
    {
      id: "#194556",
      name: "Education Dashboard",
      technology: "Angular",
      price: "$149",
    },
    {
      id: "#623232",
      name: "React UI Kit",
      technology: "React JS",
      price: "$129",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">All products</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">+ Add product</button>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">PRODUCT NAME</th>
                <th className="px-4 py-2">TECHNOLOGY</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">PRICE</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.technology}</td>
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                      <FaEdit className="h-5 w-5 mr-1" />
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
                      <FaTrashAlt className="h-5 w-5 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
