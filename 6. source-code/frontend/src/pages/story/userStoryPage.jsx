import React, { useState, useEffect } from "react";
import { useStory } from "../../hooks/useStory";
import { Loader2 } from "lucide-react";
import writeStory from "../../assets/images/writeStory.jpg";

const UserStoryPage = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    subject: "",
    story: "",
  });

  const { storeStory } = useStory();

  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  useEffect(() => {
    const isValid = Object.values(inputs).every((value) => value.trim() !== "");
    setIsFormValid(isValid);
  }, [inputs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const isDataUnchanged = () => {
    return JSON.stringify(inputs) === JSON.stringify(lastSubmittedData);
  };

  // Mock story submission function
  const mockStorySubmission = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Story submitted:", data);
        resolve();
      }, 1000); // Simulate a 2-second delay
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading || isDataUnchanged()) return;

    setIsLoading(true);
    try {
      await mockStorySubmission(inputs);
      setLastSubmittedData(inputs);
      storeStory(inputs);
      alert("Story submitted successfully!");
      // Optionally, clear the form here
      // setInputs({ name: "", email: "", subject: "", story: "" });
    } catch (error) {
      console.error("Error submitting story:", error);
      alert("Failed to submit story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[70vh] xl:h-[60vh] mb-8">
        <img
          src={writeStory}
          alt="Write Your Story"
          className="absolute w-full h-full object-cover object-center brightness-50"
        />
        <h1 className="md:text-[70px] w-full uppercase text-4xl text-center text-white font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Write Your Story
        </h1>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-4">We Love to Hear Your Story</h2>
        <p className="text-gray-700">
          Motivate and uplift others through your stories. Your personal
          narratives can become a beacon of hope, resilience, and courage in the
          twilight of stormy seas and inspire them to come out stronger and
          braver.
        </p>
      </div>

      <form
        className="max-w-xl mx-auto bg-orange-100 p-6 rounded-lg shadow-md mb-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border-2 border-gray-300 p-2 rounded-md focus:border-orange-500 focus:outline-none"
            value={inputs.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border-2 border-gray-300 p-2 rounded-md focus:border-orange-500 focus:outline-none"
            value={inputs.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full border-2 border-gray-300 p-2 rounded-md focus:border-orange-500 focus:outline-none"
            value={inputs.subject}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="story"
            placeholder="Write your story here..."
            className="w-full border-2 border-gray-300 p-2 h-48 rounded-md focus:border-orange-500 focus:outline-none resize-none"
            value={inputs.story}
            onChange={handleInputChange}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 w-full rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!isFormValid || isLoading || isDataUnchanged()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserStoryPage;
