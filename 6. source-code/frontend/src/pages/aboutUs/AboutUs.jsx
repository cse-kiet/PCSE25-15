import React from "react";
import aboutus from "./about-us.png";
import aboutUs from "../../assets/images/about-us.jpg";

const AboutUs = () => {
  return (
    <>
      <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-[80vh] lg:h-[70vh] xl:h-[60vh]">
        <img
          src={aboutUs}
          alt="writeStory"
          className="absolute w-full h-full object-cover object-cente"
        />
        <h1 className="md:text-8xl w-full uppercase text-5xl text-center text-white font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          About us
        </h1>
      </div>
      <div className="flex justify-center items-center md:flex-row flex-col mt-8 mb-8">
        <div className="md:w-1/2 flex">
          <div className="flex flex-col items-center justify-center text-justify md:w-[540px] 2xl:w-[660px] w-72 mx-auto">
            <div className="md:text-lg xl:text-2xl">
              <p>
                Our mission is to provide support and resources for individuals
                struggling with mental health issues. We believe in promoting
                mental wellness through education, awareness, and accessible
                treatment options.
                <br />
                Whether you're dealing with anxiety, depression, or any other
                mental health challenge, know that you're not alone. We're here
                to help you on your journey towards healing and recovery.
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-3/4 mx-auto">
          <img src={aboutus} alt="about-us" className="p-4" />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
