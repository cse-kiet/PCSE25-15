import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Hero from "./Hero/Hero";
import Story from "./Story/Story";
import StoriesOfHope from "./UserBlogs/storiesOfHope";
import chatImage from "../../assets/images/chatbot.png";
import { motion } from "framer-motion";

const Home = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Hero />
      <div className="flex md:flex-row flex-col justify-center items-center md:min-h-80 bg-orange-300 ">
        <div className="flex flex-col flex-grow justify-center text-justify mt-10 items-center md:max-w-[500px] max-w-80 bg-orange-50 rounded-lg p-4 hover:shadow-2xl hover:scale-105 transistion duration-300 ease-in-out">
          <div className="p-6">
            <h1 className="text-blue-500 text-3xl font-bold pb-2">
              How it Wroks?
            </h1>
            <h2>
              Go to Chatbot and communicate with it like a friend. It will
              provide you with answers to your queries about mental health as
              well.
              <br /> And then check the reports and get the suggestions.
            </h2>
          </div>
          <Link to="/about-us">
            <button className="bg-blue-500 text-white md:mt-4 hover:bg-blue-600 hover:shadow-xl">
              Know More
            </button>
          </Link>
        </div>

        {/* right components */}
        <div className="flex flex-col justify-center items-center md:min-w-[500px] mb-5">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.4 }} // Ensures the animation runs once and triggers when 20% of the element is in view
            className="items-center"
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
              className="px-6 py-10 h-full filter relative md:px-10"
            >
              <img src={chatImage} alt="chatbot" className="max-w-80" />
            </motion.div>
          </motion.div>

          <Link to={authUser ? "/chat" : "/login"}>
            <button className="bg-white text-black hover:bg-neutral-100 hover:shadow-xl">
              {authUser ? "Chat" : "Login to chat"}
            </button>{" "}
          </Link>
        </div>
      </div>

      <StoriesOfHope />
      <Story />
    </>
  );
};

export default Home;
