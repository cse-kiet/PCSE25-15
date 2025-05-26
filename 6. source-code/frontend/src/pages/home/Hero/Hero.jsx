import React from "react";
import saathiHero from "../../../assets/images/saathi-hero.jpg";

const Hero = () => {
  return (
    <div className="relative">
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] 2xl:h-[60vh]">
        <img
          src={saathiHero}
          alt="writeStory"
          className="absolute w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">
            Welcome to <span className="text-orange-400 uppercase">Saathi</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
            Your Mental Health Companion
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
