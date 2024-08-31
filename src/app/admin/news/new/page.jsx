"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function AddNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  const handleAddNews = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("sourceLink", sourceLink);
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/news"); // Redirect ke halaman daftar berita setelah berhasil menambahkan
      } else {
        console.error("Failed to add news");
      }
    } catch (error) {
      console.error("An error occurred while adding news:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Add News</h1>
        </header>
        <div className="flex items-center justify-center  bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-h-full mt-4">
            <form onSubmit={handleAddNews} className="flex flex-col gap-5">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-700">
                  Source Link
                </label>
                <input type="text" id="sourceLink" value={sourceLink} onChange={(e) => setSourceLink(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input type="file" id="imageFile" onChange={(e) => setImageFile(e.target.files[0])} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
                Add News
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
