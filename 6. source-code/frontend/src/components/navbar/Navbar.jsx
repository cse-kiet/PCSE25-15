import "./Navbar.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import saathiLogo from "../../assets/images/saathiLogo.png";
import { useAuthContext } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleScroll = () => setScrolled(window.scrollY >= 60);

  const handleMenuClick = () => setIsMenuOpen(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = (
    <>
      <NavLink to="/" className="block" onClick={handleMenuClick}>
        <li
          className={`font-bold text-gray-800 hover:text-gray-600 ${
            location.pathname === "/" ? "text-orange-500" : ""
          }`}
        >
          Home
        </li>
      </NavLink>
      <NavLink to="/faq" className="block" onClick={handleMenuClick}>
        <li
          className={`font-bold text-gray-800 hover:text-gray-600 ${
            location.pathname === "/faq" ? "text-orange-500" : ""
          }`}
        >
          FAQs
        </li>
      </NavLink>
      <NavLink to="/write-story" className="block" onClick={handleMenuClick}>
        <li
          className={`font-bold text-gray-800 hover:text-gray-600 ${
            location.pathname === "/write-story" ? "text-orange-500" : ""
          }`}
        >
          Write Your Story
        </li>
      </NavLink>
      <NavLink to="/blogs" className="block" onClick={handleMenuClick}>
        <li
          className={`font-bold text-gray-800 hover:text-gray-600 ${
            location.pathname === "/blogs" ? "text-orange-500" : ""
          }`}
        >
          Blogs
        </li>
      </NavLink>
      <NavLink
        to="/about-us"
        onClick={handleMenuClick}
        className={`font-bold text-gray-800 hover:text-gray-600 ${
          location.pathname === "/about-us" ? "text-orange-500" : ""
        }`}
      >
        About Us
      </NavLink>
      {authUser && (
        <NavLink
          to="/reports"
          onClick={handleMenuClick}
          className={`font-bold text-gray-800 hover:text-gray-600 ${
            location.pathname === "/reports" ? "text-orange-500" : ""
          }`}
        >
          Reports
        </NavLink>
      )}
      <NavLink
        to="/chat"
        onClick={handleMenuClick}
        className={`font-bold text-gray-800 hover:text-gray-600 ${
          location.pathname === "/chat" ? "text-orange-500" : ""
        }`}
      >
        Chat
      </NavLink>
    </>
  );

  // Auth buttons
  const authLinks = !authUser ? (
    <>
      <NavLink
        to="/login"
        onClick={handleMenuClick}
        className={`font-bold text-gray-800 hover:text-gray-600 ${
          location.pathname === "/login" ? "text-orange-500" : ""
        }`}
      >
        LogIn
      </NavLink>
      <NavLink
        to="/signup"
        onClick={handleMenuClick}
        className={`font-bold text-gray-800 hover:text-gray-600 ${
          location.pathname === "/signup" ? "text-orange-500" : ""
        }`}
      >
        SignUp
      </NavLink>
    </>
  ) : (
    <button
      className="font-bold text-gray-800 hover:text-gray-600"
      onClick={() => {
        handleLogout();
        handleMenuClick();
      }}
    >
      Logout
    </button>
  );

  return (
    <div
      className={`w-full flex flex-col justify-center items-center fixed top-0 z-10 bg-orange-50 transition-all ease-in-out duration-300 ${
        scrolled ? "pt-1 pr-0 bg-neutral-100 shadow-black" : ""
      }`}
    >
      <img
        src={saathiLogo}
        alt="logo"
        className={`w-[50px] mt-5 mr-2 mb-0 ml-2 transition-all duration-300 ease-in-out ${
          scrolled ? "hidden" : ""
        }`}
      />
      <header className="flex justify-between items-center w-4/5 py-2">
        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center">{navLinks}</ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4 items-center ml-auto">
          {authLinks}
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden cursor-pointer ml-auto" onClick={toggleMenu}>
          <div className="w-7 h-[3px] bg-slate-900 "></div>
          <div className="w-7 h-[3px] bg-slate-900 my-1.5"></div>
          <div className="w-7 h-[3px] bg-slate-900 my-1.5"></div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20">
          <ul className="flex flex-col gap-4 p-6">
            {navLinks}
            <div className="flex flex-col gap-2 mt-4">{authLinks}</div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
