import React from "react";
import { useParams, Link } from "react-router-dom";

const BlogPostCard = ({ blogs }) => {
  const { id } = useParams();
  const blog = blogs.find((blog) => blog.id === parseInt(id));

  if (!blog)
    return <div className="text-center mt-40">Blog post not found</div>;

  return (
    <div className="flex flex-col mt-8 max-w-4xl mx-auto px-4 py-8 ">
      <h1 className="sm:text-4xl text-2xl text-center font-bold text-gray-800 mb-4">
        {blog.title}
      </h1>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
      />
      <p className="text-gray-600 mb-6">{blog.date}</p>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed mb-8">{blog.description}</p>
        {/* If you have more content, you can add it here */}
      </div>
      <Link
        to="/blogs"
        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300 w-48 mx-auto text-center"
      >
        Back to Blog List
      </Link>
    </div>
  );
};

export default BlogPostCard;
