"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import Sidebar from "../../components/Sidebar";

export default function PlacesDashboard() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/places");
        const data = await response.json();

        // Parsing data operationalHours dan socialMedia yang berbentuk string JSON
        const parsedData = data.map((place) => {
          return {
            ...place,
            operationalHours: JSON.parse(place.operationalHours || "{}"),
            socialMedia: JSON.parse(place.socialMedia || "{}"),
          };
        });

        setPlaces(parsedData);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleEditClick = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this place?")) {
      try {
        const response = await fetch(`/api/places/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPlaces(places.filter((place) => place.id !== id));
        } else {
          console.error("Failed to delete place");
        }
      } catch (error) {
        console.error("Error deleting place:", error);
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    if (selectedPlace) {
      try {
        const response = await fetch(`/api/places/${selectedPlace.id}`, {
          method: "PUT",
          body: formData,
        });

        if (response.ok) {
          const updatedPlace = await response.json();
          const updatedPlaces = places.map((place) => (place.id === updatedPlace.id ? updatedPlace : place));
          setPlaces(updatedPlaces);

          handleModalClose(); // Menutup modal setelah submit berhasil
          router.push("/admin/places"); // Redirect to the main places page
        } else {
          console.error("Failed to update place:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error updating place:", error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">All Places</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => router.push("/admin/places/new")}>
            + Add Place
          </button>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">IMAGES</th>
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">CREATED AT</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {places && places.length > 0 ? (
                places.map((place) => (
                  <tr key={place.id} className="border-t">
                    <td className="px-4 py-2">
                      {(() => {
                        try {
                          const images = JSON.parse(place.images);
                          return images.map((image, index) => <img key={index} src={image} alt={place.name} className="h-16 w-16 object-cover inline-block mr-2" />);
                        } catch (error) {
                          console.error("Error parsing images JSON:", error);
                          return <p>No images available</p>;
                        }
                      })()}
                    </td>
                    <td className="px-4 py-2">{place.name}</td>
                    <td className="px-4 py-2">{new Date(place.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button onClick={() => handleEditClick(place)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(place.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    No places available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedPlace && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[40rem] overflow-y-auto scroll-hidden">
              <h2 className="text-xl font-semibold mb-4">Edit Place</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input type="text" name="name" defaultValue={selectedPlace.name} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea name="description" defaultValue={selectedPlace.description} className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Rating</label>
                  <input type="number" name="rating" defaultValue={selectedPlace.rating} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input type="text" name="address" defaultValue={selectedPlace.address} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Type</label>
                  <input type="text" name="type" defaultValue={selectedPlace.type} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Operational Hours</label>
                  <div className="flex space-x-2">
                    <input type="text" name="openTime" placeholder="Open Time" defaultValue={selectedPlace.operationalHours?.open} className="w-1/2 p-2 border border-gray-300 rounded-lg" />
                    <input type="text" name="closeTime" placeholder="Close Time" defaultValue={selectedPlace.operationalHours?.close} className="w-1/2 p-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Maps URL</label>
                  <input type="text" name="maps" defaultValue={selectedPlace.maps} className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Social Media (JSON Format)</label>
                  <textarea name="socialMedia" defaultValue={JSON.stringify(selectedPlace.socialMedia, null, 2)} className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Image</label>
                  {selectedPlace && Array.isArray(selectedPlace.images) && selectedPlace.images.length > 0 && (
                    <div className="mb-2">
                      {selectedPlace.images.map((image, index) => (
                        <img key={index} src={image} alt="Current Place" className="h-16 w-16 object-cover" />
                      ))}
                    </div>
                  )}
                  <label className="block text-gray-700">Upload New Image</label>
                  <input type="file" name="file" className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
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
    </div>
  );
}
