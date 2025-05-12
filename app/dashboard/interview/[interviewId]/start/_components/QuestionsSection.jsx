import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const texttospeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Browser doesnot support text to speech");
    }
  };
  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`p-3 rounded-xl text-sm md:text-base text-center cursor-pointer font-medium transition-all duration-300 ease-in-out
                ${
                  activeQuestionIndex === index
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl scale-105"
                    : "bg-white border border-gray-300 hover:bg-gray-100 hover:shadow-md"
                }`}
            >
              Question #{index + 1}
            </h2>
          ))}
      </div>
      <Button
        onClick={() =>
          texttospeech(mockInterviewQuestion[activeQuestionIndex]?.question)
        }
      >
        press
      </Button>

      <div className="p-5 bg-white rounded-xl shadow-lg text-lg font-semibold text-gray-800">
        {mockInterviewQuestion[activeQuestionIndex]?.question || (
          <span className="text-gray-500">Select a question to view.</span>
        )}
      </div>

      <div className="mt-8 p-5 bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-xl shadow-md flex items-start space-x-3">
        <Info className="text-blue-600 w-6 h-6 mt-1" />
        <div>
          <h3 className="text-lg font-semibold">How to Use This Section?</h3>
          <p className="text-sm mt-1 text-gray-700 leading-relaxed">
            Click on any **question** to view its details in the section above.
            The active question is **highlighted in blue**. This helps in easy
            navigation during your mock interview.
          </p>
          <p className="text-sm mt-1 text-gray-700">
            Ensure to **stay focused** while practicing and try to answer within
            a time limit to simulate a real interview environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
