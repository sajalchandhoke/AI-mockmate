"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ghost, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [opendialog, setopendialog] = useState(false);
  const [JobRole, setJobRole] = useState("");
  const [JobDesc, setJobDesc] = useState("");
  const [JobExperience, setJobExperience] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing.");
      setResponse("Error: API Key not found.");
      setLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192
        }
      });

      const InputPrompt = `
        Job Position: ${JobRole}, 
        Job Description: ${JobDesc},
        Years of Experience: ${JobExperience}. 

        Based on the Job Role, Job Description, and Years of Experience, 
        generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT || 5} 
        interview questions along with answers in JSON format.
      `;

      const result = await chatSession.sendMessage(InputPrompt);
      const aiResponse = result.response
        .text()
        .replaceAll("```json", "")
        .replaceAll("```", "");
      setResponse(aiResponse);
      console.log(aiResponse);

      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: aiResponse,
          jobPosition: JobRole,
          jobDesc: JobDesc,
          jobExperience: JobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD")
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID", resp);
      if (resp) {
        setopendialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }

      setResponse("Interview saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching AI response or saving to database.");
    }

    setLoading(false);
    setopendialog(false);
  };

  return (
    <div>
      <div
        onClick={() => setopendialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={opendialog} onOpenChange={setopendialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2 className="font-semibold text-lg">
                    Add details about the job role, description, and experience
                  </h2>

                  <div className="mt-5 my-3">
                    <label>Job Role</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      value={JobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                    />
                  </div>

                  <div className="my-3">
                    <label>Job Description / Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React, Node.js, MySQL, etc."
                      required
                      value={JobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={JobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Proceed"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setopendialog(false)}
                    variant={Ghost}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
