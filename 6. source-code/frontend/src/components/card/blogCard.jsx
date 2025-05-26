import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ story }) => {
  return (
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
        <div className="flex flex-col flex-grow bg-white rounded-lg shadow-lg overflow-hidden max-w-80 max-h-96 transition-transform duration-300 ease-in-out transform hover:shadow-2xl min-h-[376px]">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col flex-grow">
            <p className="text-gray-500 text-sm">{story.date}</p>
            <h3 className="text-xl font-bold mb-2">{story.title}</h3>
            <Link
              to={`/blogs/${story.id}`}
              className="bg-orange-500 text-white text-center px-4 py-2 rounded inline-block w-40 mx-auto mt-auto hover:bg-orange-600 hover:shadow-2xl"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogCard;
