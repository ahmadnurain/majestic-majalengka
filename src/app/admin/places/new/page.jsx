"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import "../../../globals.css";

export default function AddPlaceForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const [maps, setMaps] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [files, setFiles] = useState([]); // Array to hold multiple files

  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Add new files to the existing array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("rating", rating);
    formData.append("address", address);
    formData.append("type", type);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);
    formData.append("maps", maps);
    formData.append("socialMedia", socialMedia);

    files.forEach((file) => {
      formData.append("file", file); // Append each file to the formData
    });

    try {
      const response = await fetch("/api/places", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/places");
      } else {
        console.error("Error creating place");
      }
    } catch (error) {
      console.error("Failed to create place:", error);
    }
  };

  return (
    <div className="flex  h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 px-8 pt-8">
        <header className="flex justify-between items-center ">
          <h1 className="text-3xl font-semibold text-gray-800">Add Place</h1>
        </header>
        <div className="flex items-center justify-center h-screen bg-gray-100 -mt-5">
          <div className="bg-white p-8 rounded-lg shadow-md w-full  max-h-[38rem] overflow-y-auto scroll-hidden">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Place Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Open Time</label>
                <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Close Time</label>
                <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Maps Link</label>
                <input type="text" value={maps} onChange={(e) => setMaps(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Social Media</label>
                <input type="text" value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                <input type="file" multiple onChange={handleFileChange} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>

              {/* Display selected file names */}
              {files.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  <ul className="list-disc pl-5">
                    {files.map((file, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Add Place
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
