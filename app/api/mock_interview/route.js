import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { jobRole, jobDesc, jobExperience, createdBy } = await req.json();

    const result = await db.insert(MockInterview).values({
      mockId: uuidv4(),
      jsonMockResp: jsonData,
      jobPosition: jobRole,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt: moment().format("DD-MM-yyyy")
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
