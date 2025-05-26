import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-800 md:py-4">
      <div className="flex flex-row justify-around items-center min-h-32">
        <div className="md:items-center md:justify-center">
          <div className="flex flex-col text-neutral-200">
            <ul>
              <Link to="/about-us">
                <li>About Us</li>
              </Link>
              <Link to="/blogs">
                <li>Blogs</li>
              </Link>
              <li>Privacy Policy</li>
              <li>Contact us</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col text-neutral-200">
          <div className="">
            <ul>
              <li>Our Team</li>
              <li>Help</li>
              <li>Phone: +91 6398472576</li>
              <li>Email: ashutoshrgnict@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-1/2 bg-zinc-700 mx-auto"></div>
      <div>
        <p className="text-center bg-zinc-800 text-neutral-200 p-2">
          &copy; 2024 All Rights Reserved
        </p>
        <p className="text-center text-neutral-300 p-2 text-sm">
          Disclaimer: We are working to deliver a product to help people know
          about mental health and their own mental stress level in an
          interactive way
        </p>
      </div>
    </footer>
  );
};

export default Footer;
