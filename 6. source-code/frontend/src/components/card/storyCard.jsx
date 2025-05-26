import React from "react";
import { Link } from "react-router-dom";

const StoryCard = ({ story }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden w-80 group flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 min-h-[376px]">
      <img
        src={story.image}
        alt={story.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-500 text-sm">{story.date}</p>
        <h3 className="text-xl font-bold mb-2 flex-grow">{story.title}</h3>
        <Link
          to={`/story/${story.id}`}
          className="bg-orange-500 hover:bg-orange-600 hover:shadow-2xl text-white px-4 py-2 w-40 mx-auto rounded mt-auto"
        >
          Read Story
        </Link>
      </div>
    </div>
  );
};

export default StoryCard;
