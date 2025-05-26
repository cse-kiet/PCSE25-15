import React, { useState } from "react";
import faq from "../../assets/images/faq.jpeg";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is this website for?",
    answer:
      "This website is a mental stress detection application specially for teenagers through chat.",
  },
  {
    question: "How to check mental stress?",
    answer:
      "When you chat your responses are analyzed and a report is generated on that basis.",
  },
  {
    question: "Is the chat only for teenagers?",
    answer:
      "No, it is suitable for all age groups. The things is it is more Interrogative so that users provide their feelings and all to the ML model.",
  },
];

const Faq = () => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-[80vh] lg:h-[70vh] xl:h-[60vh]">
          <img
            src={faq}
            alt="writeStory"
            className="absolute w-full h-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 bg-orange-50 p-6 rounded-lg">
          <div className="flex flex-col w-full md:w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-2">
              {faqs.map((faq, index) => (
                <li key={index}>
                  <div
                    className="cursor-pointer p-2 bg-white rounded shadow hover:bg-orange-100"
                    onClick={() =>
                      setSelectedQuestionIndex(
                        selectedQuestionIndex === index ? null : index
                      )
                    }
                  >
                    {faq.question}
                  </div>
                  <AnimatePresence>
                    {selectedQuestionIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white rounded shadow mt-2">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Faq;
