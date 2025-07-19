import { NextRequest, NextResponse } from "next/server";
import { getChallengeById } from "@/lib/challengeService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise in Next.js 15
    const { id } = await params;
    const challenge = await getChallengeById(id);

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
