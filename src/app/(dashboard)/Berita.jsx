"use client";

import React, { useEffect, useState } from "react";
import { VscEye } from "react-icons/vsc";

const Berita = () => {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setBerita(data);
      } catch (error) {
        console.error("Error fetching berita:", error);
      }
    };

    fetchBerita();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        {berita.map((item) => (
          <div key={item.id} className="flex justify-between gap-5 border p-5 max-md:flex-col">
            <div
              className="md:w-[28rem] h-52 bg-center bg-cover bg-no-repeat "
              style={{
                backgroundImage: `url(${item.imageUrl.replace(/\\/g, "/")})`, // Ganti backslashes dengan forward slashes
                backgroundSize: "cover", // Pastikan gambar menutupi seluruh area
                backgroundPosition: "center", // Posisikan gambar di tengah
              }}
            ></div>

            <div className="flex flex-col justify-between">
              <div>
                <a href={`/berita/${item.id}`} className="font-bold text-text-header text-2xl hover:underline">
                  {item.title}
                </a>
                <p className="text-sm text-justify text-text-header mt-2">{item.content.slice(0, 150)}...</p>
              </div>
              <div className="flex justify-between items-end mt-10">
                <div className="text-text-header">
                  <h1 className="font-semibold">{item.authorName}</h1>
                  <p className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <VscEye /> <p>{item.reads}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Berita;
