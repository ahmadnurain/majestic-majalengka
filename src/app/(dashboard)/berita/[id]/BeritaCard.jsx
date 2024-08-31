import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { VscEye } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

const BeritaCard = ({ title, imageUrl, authorName, publishedDate, reads, likes }) => {
  return (
    <div className="border">
      <div className="w-full h-52 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${imageUrl.replace(/\\/g, "/")})` }}></div>
      <div className="p-3">
        <div className="flex items-center text-text-header gap-3 my-5">
          <CgProfile size={40} />
          <div className="">
            <h1 className="font-bold">{authorName}</h1>
            <p className="text-xs">{publishedDate}</p>
          </div>
        </div>
        <h1 className="text-text-header text-xl font-bold my-5">{title}</h1>
        <div className="flex gap-3 items-center">
          <div className="flex items-center text-sm">
            <AiOutlineLike size={22} />
            <p>{likes}</p>
          </div>
          <div className="flex items-center text-sm">
            <VscEye size={25} />
            <p>{reads}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaCard;
