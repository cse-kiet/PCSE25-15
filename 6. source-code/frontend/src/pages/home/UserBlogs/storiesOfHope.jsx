import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import StoryCard from "../../../components/card/storyCard";

import { motion } from "framer-motion";
import stories from "./stories.js";

const StoriesOfHope = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 3 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === stories.length - 3 ? 0 : prevIndex + 1
    );
  };

  const loadMore = () => {
    setMobileIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-orange-50 py-1 p-4">
      <div className="container mx-auto text-center relative mb-6 mt-4 ">
        <h2 className="text-3xl font-bold mb-4">STORIES OF HOPE</h2>
        <p className="text-gray-700 mb-8">
          Sharing is caring! Encourage and inspire others with your stories.
          Your experiences can give them the courage to face their fears,
          overcome their struggles, and come out stronger.
        </p>

        {/* Desktop view */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }} // Ensures the animation runs once and triggers when 20% of the element is in view
        >
          <motion.div
            variants={{
              offscreen: {
                y: 150,
              },
              onscreen: {
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 1,
                },
              },
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="hidden md:flex flex-row items-center justify-center">
              <button
                onClick={prevSlide}
                className="text-orange-500 hover:text-orange-700"
              >
                <FaArrowLeft size={30} />
              </button>
              <div className="flex flex-row space-x-4 ">
                {stories.slice(currentIndex, currentIndex + 3).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="text-orange-500 hover:text-orange-700"
              >
                <FaArrowRight size={30} />
              </button>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
              <div className="flex flex-col mb-8 w-80 mx-auto">
                <StoryCard
                  key={stories[mobileIndex].id}
                  story={stories[mobileIndex]}
                />
              </div>
              <button
                onClick={loadMore}
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300 mb-4"
              >
                Load Another
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoriesOfHope;
