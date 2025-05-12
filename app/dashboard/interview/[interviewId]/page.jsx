"use client";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { use } from "react";

const Interview = ({ params }) => {
  const { interviewId } = use(params);
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const GetInterviewDetails = async (id) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, id));

      if (result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <h2 className="font-bold text-3xl text-gray-900">🚀 Let's Get Started</h2>
      <p className="text-gray-500 mt-2 text-center">
        Prepare yourself for an interactive mock interview experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mt-10">
        {/* Left - Webcam Section */}
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
          {webcamEnabled ? (
            <Webcam
              key={webcamEnabled}
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="rounded-lg border shadow-md"
              style={{ height: 300, width: "100%" }}
            />
          ) : (
            <WebcamIcon className="h-72 w-72 my-7 p-16 text-gray-500 bg-gray-200 rounded-lg border" />
          )}
          <Button
            onClick={() => setWebcamEnabled((prev) => !prev)}
            className="mt-5 w-full"
          >
            {webcamEnabled ? "Disable Camera" : "Enable Camera & Microphone"}
          </Button>
        </div>

        {/* Right - Interview Info Section */}
        <div className="flex flex-col bg-white shadow-lg p-6 rounded-lg border">
          {interviewData ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">
                Job Role:{" "}
                <span className="font-normal">{interviewData.jobPosition}</span>
              </h2>
              <h2 className="text-lg font-semibold text-gray-900 mt-2">
                Description:{" "}
                <span className="font-normal">{interviewData.jobDesc}</span>
              </h2>
              <h2 className="text-lg font-semibold text-gray-900 mt-2">
                Years of Experience:{" "}
                <span className="font-normal">
                  {interviewData.jobExperience} years
                </span>
              </h2>
            </>
          ) : (
            <p className="text-gray-500 animate-pulse">
              Fetching interview details...
            </p>
          )}

          <div className="bg-yellow-100 p-4 rounded-lg mt-6 text-yellow-900 border-l-4 border-yellow-500">
            <strong>Pro Tip:</strong> The interview will begin shortly. Stay
            calm, maintain eye contact, and answer confidently. You're ready for
            this!
          </div>
          <div className="flex justify-end mt-30 items-end">
            <Link href={`/dashboard/interview/${interviewId}/start`}>
              <Button>Start Interview</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
