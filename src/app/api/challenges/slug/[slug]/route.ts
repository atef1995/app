import { NextRequest, NextResponse } from "next/server";
import { getChallengeBySlug } from "@/lib/challengeService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Challenge slug is required" },
        { status: 400 }
      );
    }

    const challenge = await getChallengeBySlug(slug);

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error fetching challenge by slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
