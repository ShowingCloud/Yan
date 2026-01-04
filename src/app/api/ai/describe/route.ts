import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const describeSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = describeSchema.parse(body);

    // TODO: Implement image description logic
    // This will push to Redis queue and return job ID
    return NextResponse.json({ jobId: "placeholder-job-id" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

