import React from "react";
import Author from "./Author";

const Content = ({ title, content, imageUrl, authorName, publishedDate, sourceLink }) => {
  const safeImageUrl = imageUrl ? imageUrl.replace(/\\/g, "/") : "/path/to/default/image.jpg"; // Gambar default jika imageUrl undefined

  return (
    <div>
      <div
        className="h-72 w-full bg-bottom bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${safeImageUrl})`,
        }}
      ></div>
      <div className="text-justify mt-10 flex flex-col gap-5">
        <h1 className="text-3xl font-bold">{title}</h1>
        {content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <p>
          Sumber:{" "}
          <a href={sourceLink} className="text-blue-500 hover:underline">
            {sourceLink}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Content;
