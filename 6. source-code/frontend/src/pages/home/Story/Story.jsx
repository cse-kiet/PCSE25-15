import React from "react";
import story from "../../../assets/images/story.jpg";
import { Link } from "react-router-dom";

const Story = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-4 mx-auto md:space-x-8 space-y-8 md:space-y-0 max-w-7xl">
      <div className="flex justify-center">
        <img src={story} alt="Story" className="md:w-[500px] w-96" />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start w-80 md:w-[500px] text-center md:text-left mx-auto">
        <h1 className="text-2xl">We Love to Hear Your Story</h1>
        <p className="mt-4">
          Motivate and uplift others through your stories. Your personal
          narratives can become a beacon of hope, resilience, and courage in the
          twilight of stormy seas and inspire them to come out stronger and
          braver.
        </p>
        <Link to="/write-story">
          <button className="bg-orange-500 w-40 text-white mt-4 hover:shadow-lg hover:bg-orange-600">
            Write Your Story
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Story;
