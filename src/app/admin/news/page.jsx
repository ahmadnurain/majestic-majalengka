"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function NewsDashboard() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null); // State untuk berita yang akan diedit
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [isLoading, setIsLoading] = useState(true);
  const [newImageFile, setNewImageFile] = useState(null); // State untuk file gambar baru
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news"); // Pastikan endpoint benar
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]); // Set ke array kosong jika terjadi error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this news?")) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setNews(news.filter((newsItem) => newsItem.id !== id)); // Hapus berita dari state
        } else {
          console.error("Failed to delete news");
        }
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true); // Buka modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Tutup modal
    setSelectedNews(null);
    setNewImageFile(null); // Reset file gambar baru
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let imageUrl = selectedNews.imageUrl;

    if (newImageFile) {
      // Jika ada file gambar baru, upload file baru
      const formData = new FormData();
      formData.append("file", newImageFile);

      const uploadResponse = await fetch("/api/news/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.filePath; // Path gambar baru
      } else {
        console.error("Failed to upload new image");
        return;
      }
    }

    try {
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedNews, imageUrl }), // Update dengan URL gambar baru
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setNews(news.map((item) => (item.id === updatedNews.id ? updatedNews : item)));
        closeModal(); // Tutup modal setelah berhasil update
      } else {
        console.error("Failed to update news");
      }
    } catch (error) {
      console.error("An error occurred while updating news:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">All News</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => router.push("/admin/news/new")}>
            + Add News
          </button>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm">IMAGE</th>
                <th className="px-4 py-2 text-sm">TITLE</th>
                <th className="px-4 py-2 text-sm">CREATED AT</th>
                <th className="px-4 py-2 text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {news && news.length > 0 ? (
                news.map((newsItem) => (
                  <tr key={newsItem.id} className="border-t">
                    <td className="px-4 py-2">
                      <img src={newsItem.imageUrl.replace(/\\/g, `/`)} alt={newsItem.title} className="w-20 h-20 object-cover" />
                    </td>
                    <td className="px-4 py-2">{newsItem.title}</td>
                    <td className="px-4 py-2">{new Date(newsItem.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 mt-4 flex space-x-2 items-center ">
                      <button onClick={() => handleEdit(newsItem)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FaEdit className="h-5 w-5 mr-1" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(newsItem.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FaTrashAlt className="h-5 w-5 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No news found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit News</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input type="text" id="title" value={selectedNews.title} onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea id="content" value={selectedNews.content} onChange={(e) => setSelectedNews({ ...selectedNews, content: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Current Image
                </label>
                <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-20 h-20 object-cover mb-2" />
                <label htmlFor="newImage" className="block text-sm font-medium text-gray-700">
                  Upload New Image
                </label>
                <input type="file" id="newImage" onChange={(e) => setNewImageFile(e.target.files[0])} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-700">
                  Source Link
                </label>
                <input type="text" id="sourceLink" value={selectedNews.sourceLink} onChange={(e) => setSelectedNews({ ...selectedNews, sourceLink: e.target.value })} className="mt-1 p-2 block w-full border border-gray-300 rounded" />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
