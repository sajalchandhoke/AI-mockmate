"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { chatSession } from "@/utils/GeminiAIModels";
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ");
          setUserAnswer(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
        };

        recognitionRef.current = recognition;
      } else {
        console.error(
          "Speech Recognition API is NOT supported in this browser."
        );
      }
    }
  }, []);

  const handleRecording = async () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not available.");
      return;
    }

    if (isRecording) {
      setLoading(true);
      recognitionRef.current.stop();
      setIsRecording(false);

      if (!userAnswer || userAnswer.length < 5) {
        toast.error("Answer is too short. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Answer recorded successfully!");

      const feedbackPrompt = `
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question},
        User Answer: ${userAnswer}.
        Based on the answer, provide a rating out of 10 and feedback.
        in JSON format.
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonresp = result.response
        .text()
        .replaceAll("```json", "")
        .replaceAll("```", "");

      let JsonFeedbackresp;
      try {
        JsonFeedbackresp = JSON.parse(mockJsonresp);
      } catch (error) {
        console.error("Failed to parse JSON feedback:", error);
        toast.error("Failed to generate feedback.");
        setLoading(false);
        return;
      }

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackresp?.feedback,
        rating: JsonFeedbackresp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy")
      });

      if (resp) toast("User Answer Recorded");
      setLoading(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4 bg-background">
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <Webcam mirrored className="w-full h-full object-cover" />
      </div>

      <Button
        variant={isRecording ? "destructive" : "outline"}
        className="mt-8 w-60 text-lg"
        onClick={handleRecording}
        disabled={loading}
      >
        {isRecording ? "🔴 Recording..." : "🎤 Start Recording"}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
