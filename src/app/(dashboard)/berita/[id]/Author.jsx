"use client";

import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLike, AiFillLike } from "react-icons/ai"; // Impor kedua ikon
import { VscEye } from "react-icons/vsc";

const Author = ({ authorName, publishedDate, likes, views, onLike }) => {
  const [liked, setLiked] = useState(false); // State untuk melacak apakah sudah di-like
  const [currentLikes, setCurrentLikes] = useState(likes); // State untuk menyimpan jumlah like saat ini

  const handleLike = () => {
    if (!liked) {
      onLike(); // Panggil fungsi onLike hanya jika belum di-like
      setLiked(true); // Set state ke true setelah di-like
      setCurrentLikes(currentLikes + 1); // Tambah jumlah like secara visual
    }
  };

  return (
    <div className="pt-16 pb-8 flex w-full justify-between">
      <div className="flex items-center text-text-header gap-3">
        <CgProfile size={40} />
        <div className="">
          <h1 className="font-bold max-md:text-sm">{authorName}</h1>
          <p className="text-xs">{publishedDate}</p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div
          className="flex items-center text-sm"
          onClick={handleLike}
          style={{ cursor: "pointer", color: liked ? "black" : "inherit" }} // Ubah warna jika di-like
        >
          {liked ? <AiFillLike size={22} /> : <AiOutlineLike size={22} />} {/* Ganti ikon berdasarkan state */}
          <p>{currentLikes}</p> {/* Tampilkan jumlah like yang diperbarui */}
        </div>
        <div className="flex items-center text-sm">
          <VscEye size={25} />
          <p>{views}</p>
        </div>
      </div>
    </div>
  );
};

export default Author;
