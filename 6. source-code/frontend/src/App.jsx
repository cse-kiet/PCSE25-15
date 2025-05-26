import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import AnimatedRoutes from "./components/routes/AnimatedRoutes";
import ScrollToTop from "./utils/scrollTop.js";
import MentalHealthDashboard from "./pages/reports/Reports.jsx";

const AppLayout = () => {
  return (
    <div className="app flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <AnimatedRoutes />
      <Footer className="mt-auto" />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone reports route */}
        <Route path="/reports" element={<MentalHealthDashboard />} />

        {/* All other pages go through the layout */}
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
