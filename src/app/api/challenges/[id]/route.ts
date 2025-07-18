import { NextRequest, NextResponse } from "next/server";
import { getChallengeById } from "@/lib/challengeService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = await getChallengeById(params.id);

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
