"use client";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
function Feedback() {
  const [feedbacklist, setfeedbacklist] = useState([]);
  const router = useRouter();
  const params = useParams(); // 👈 Get route params in a client component
  const interviewId = params?.interviewId;

  useEffect(() => {
    if (interviewId) {
      GetFeedback();
    }
  }, [interviewId]);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);
    console.log(result);
    setfeedbacklist(result);
  };

  return (
    <div className="p-10">
      {feedbacklist.length === 0 ? (
        <h2 className="text-primary text-lg my-3">No Records Found</h2>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-green-500">
            CONGRATULATIONS..
          </h2>
          <h2 className="font-bold text-2xl">
            Here is your Interview Feedback
          </h2>
          <h2>
            Find below interview questions with correct answers and feedback
          </h2>

          {feedbacklist.map((item, index) => (
            <Collapsible className="mt-7" key={index}>
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg text-left m-2 my-2 flex justify-between gap-7 w-full">
                {item.question}
                <ChevronsUpDownIcon className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border-rounded-lg">
                    <strong>Rating: </strong>
                    {item.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm">
                    <strong>Your Answer: </strong>
                    {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm">
                    <strong>Correct Answer: </strong>
                    {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm">
                    <strong>Feedback: </strong>
                    {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}

      <Button className="mt-5" onClick={() => router.replace("/dashboard")}>
        Go to Home
      </Button>
    </div>
  );
}

export default Feedback;
