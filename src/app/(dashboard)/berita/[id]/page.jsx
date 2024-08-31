"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Content from "./Content";
import Subscribe from "@/app/components/Subscribe";
import Footer from "@/app/components/Footer";
import Author from "./Author";
import BeritaCard from "./BeritaCard"; // Pastikan komponen BeritaCard di-import

const Berita = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]); // Tambahkan state untuk relatedNews

  useEffect(() => {
    if (id) {
      const fetchBerita = async () => {
        try {
          const response = await fetch(`/api/news/${id}`);
          if (!response.ok) {
            throw new Error(`Error fetching berita with ID: ${id}`);
          }
          const data = await response.json();
          setBerita(data);

          // Fetch related news
          const relatedResponse = await fetch(`/api/news?relatedTo=${id}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedNews(relatedData);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchBerita();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/news/${id}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to update likes");
      }
      const data = await response.json();
      setBerita((prevBerita) => ({
        ...prevBerita,
        likes: data.likes,
      }));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  if (!berita) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-32">
      <h1 className="text-center text-xl md:text-3xl font-bold text-text-header md:w-1/2 mx-auto">{berita.title}</h1>
      <div className="px-[3%] md:px-[15%]">
        <Author authorName={berita.authorName} publishedDate={new Date(berita.createdAt).toLocaleDateString()} likes={berita.likes || 0} views={berita.reads || 0} onLike={handleLike} />

        <Content title={berita.title} content={berita.content} imageUrl={berita.imageUrl} authorName={berita.authorName} publishedDate={new Date(berita.createdAt).toLocaleDateString()} sourceLink={berita.sourceLink} />
        <h1 className="text-3xl font-bold text-text-header mt-16">Berita Lainnya yang Serupa</h1>
        <div className="grid md:grid-cols-2 gap-5 mb-16 mt-5">
          {relatedNews.map((newsItem) => (
            <BeritaCard
              key={newsItem.id}
              title={newsItem.title}
              imageUrl={newsItem.imageUrl}
              authorName={newsItem.authorName}
              publishedDate={new Date(newsItem.createdAt).toLocaleDateString()}
              reads={newsItem.reads || 0}
              likes={newsItem.likes || 0}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center items-center my-16">
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default Berita;
