import React from "react";
import Home from "../../pages/home/Home";
import FAQPage from "../../pages/faq/Faq";
import SignUp from "../../pages/signUp/SignUp";
import Login from "../../pages/login/Login";
import Chat from "../../pages/chatbot/Chat";
import AboutUs from "../../pages/aboutUs/AboutUs";
import UserStoryPage from "../../pages/story/userStoryPage";
import BlogPage from "../../pages/blogs/blogPage";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { Routes, Route, useLocation } from "react-router-dom";

// import MentalHealthDashboard from "../../pages/reports/Reports";

import { AnimatePresence } from "framer-motion";
import Layout from "../../utils/Layout";
import StoryPostCard from "../card/storyPostCard";

const AnimatedRoutes = () => {
  const { authUser } = useAuthContext();
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/chat" element={<Chat />} />

          {/* <Route path="/reports" element={<MentalHealthDashboard />} /> */}

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/write-story" element={<UserStoryPage />} />
          <Route path="/blogs/*" element={<BlogPage />} />
          <Route path="/story/:id" element={<StoryPostCard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
