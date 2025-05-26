import React from "react";
import BlogCard from "../../components/card/blogCard";
import BlogPostCard from "../../components/card/blogPostCard";
import image1 from "../../assets/blog/image1.png";
import image2 from "../../assets/blog/image2.jpg";
import image3 from "../../assets/blog/image3.jpeg";
import image4 from "../../assets/blog/image4.jpeg";
import image5 from "../../assets/blog/image5.jpg";
import image6 from "../../assets/blog/image6.jpeg";
import { Routes, Route, useNavigate } from "react-router-dom";

const blogs = [
  {
    id: 1,
    date: "July 15, 2024",
    title: "Understanding Mental Health: Breaking the Stigma",
    description:
      "Mental health is an integral part of our overall well-being, yet it often carries a stigma that prevents people from seeking the help they need. In this blog, we explore what mental health means, the common misconceptions surrounding it, and why it's crucial to break the stigma. By sharing real-life stories and expert insights, we aim to foster a more compassionate and informed society.",
    image: image1,
  },
  {
    id: 2,
    date: "July 20, 2024",
    title: "Identifying Mental Stress: Early Signs and Symptoms",
    description:
      "Mental stress can manifest in various ways, affecting both our mental and physical health. Early detection is key to managing stress effectively. This blog delves into the common signs and symptoms of mental stress, such as changes in sleep patterns, mood swings, and physical ailments. Learn how to recognize these early warning signs and take proactive steps to address them.",
    image: image2,
  },
  {
    id: 3,
    date: "July 25, 2024",
    title: "Mindfulness and Meditation: Powerful Tools for Stress Relief",
    description:
      "In today's fast-paced world, mindfulness and meditation have become essential practices for reducing stress and improving mental clarity. This blog introduces readers to the basics of mindfulness and meditation, providing practical tips and techniques to incorporate these practices into daily life. Discover how a few minutes of mindfulness each day can transform your mental health.",
    image: image3,
  },
  {
    id: 4,
    date: "July 30, 2024",
    title: "The Role of Physical Exercise in Managing Mental Health",
    description:
      "Physical exercise is not only beneficial for our bodies but also plays a significant role in maintaining mental health. This blog explores the connection between physical activity and mental well-being, highlighting how regular exercise can reduce symptoms of depression and anxiety. Learn about different types of exercises and how to create a routine that supports both your physical and mental health.",
    image: image4,
  },
  {
    id: 5,
    date: "August 5, 2024",
    title: "Coping with Anxiety: Strategies for a Calmer Mind",
    description:
      "Anxiety can be overwhelming, but there are effective strategies to manage it and regain control. This blog provides a comprehensive guide to coping with anxiety, including cognitive-behavioral techniques, relaxation exercises, and lifestyle changes. Discover practical methods to reduce anxiety and build resilience in the face of life's challenges.",
    image: image5,
  },
  {
    id: 6,
    date: "August 10, 2024",
    title:
      "Building a Support System: The Importance of Community in Mental Health",
    description:
      "Having a strong support system is vital for mental health. This blog discusses the importance of community and social connections in maintaining mental well-being. Learn how to build and nurture a support network, the role of friends and family, and the benefits of seeking professional help. Emphasize the power of connection and the impact it can have on mental health recovery and maintenance.",
    image: image6,
  },
];

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col justify-center items-center mx-auto max-w-[85rem] w-3/4">
            <h1 className="text-3xl font-bold text-center mt-10 mb-8 uppercase">
              Blogs
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} story={blog} />
              ))}
            </div>
          </div>
        }
      />
      <Route
        path=":id"
        element={<BlogPostCard blogs={blogs} navigate={navigate} />}
      />
    </Routes>
  );
};

export default BlogPage;
