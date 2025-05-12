"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = () => {
  const { interviewId } = useParams();
  const [interviewData, setinterviewData] = useState();
  const [mockInterviewQuestion, setmockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setactiveQuestionIndex] = useState(0);
  useEffect(() => {
    GetInterviewDetails();
  }, []);
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result.length) {
        console.error("⚠️ No interview found!");
        return;
      }

      const rawText = result[0].jsonMockResp;
      console.log("📦 Raw JSON Text:", rawText);

      const parsedData = JSON.parse(rawText);
      if (!Array.isArray(parsedData) || !parsedData[0]?.question) {
        console.error("❌ Invalid format: Missing questions");
        return;
      }

      setmockInterviewQuestion(parsedData);
      setinterviewData(result[0]);
    } catch (error) {
      console.error("❌ Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-cols md:flex-row gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setactiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setactiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
