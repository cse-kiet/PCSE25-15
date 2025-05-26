import React from "react";
import { useParams, Link } from "react-router-dom";
import stories from "../../pages/home/UserBlogs/stories.js";

const StoryPostCard = () => {
  const { id } = useParams();
  const story = stories.find((story) => story.id === parseInt(id));

  if (!story)
    return <div className="text-center mt-40">story post not found</div>;

  return (
    <div className="flex flex-col mt-8 max-w-4xl mx-auto px-4 py-8 ">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{story.title}</h1>
      <img
        src={story.image}
        alt={story.title}
        className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
      />
      <p className="text-gray-600 mb-6">{story.date}</p>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed mb-8">
          {story.description}
        </p>
        {/* If you have more content, you can add it here */}
      </div>
      <Link
        to="/"
        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300 w-48 mx-auto text-center"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default StoryPostCard;
