import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () => {
    router.push("dashboard/interview/" + interview?.mockId);
  };

  const onFeedback = () => {
    router.push("dashboard/interview/" + interview?.mockId + "/feedback");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-md transition hover:shadow-lg border border-gray-200">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-blue-600">
          {interview?.jobPosition}
        </h2>
        <p className="text-sm text-gray-500">
          {interview?.jobExperience} Years of Experience
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Created At: {formatDate(interview?.createdAt)}
        </p>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="w-[50%] transition hover:border-blue-500"
          onClick={onFeedback}
        >
          Feedback
        </Button>
        <Button
          className="w-[45%] bg-blue-600 hover:bg-blue-700 text-white transition"
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
