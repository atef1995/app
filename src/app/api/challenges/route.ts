import { NextRequest, NextResponse } from "next/server";
import {
  getAllChallenges,
  getFilteredChallenges,
} from "@/lib/challengeService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");

    let challenges;

    if (type || difficulty) {
      challenges = await getFilteredChallenges({
        type: type || undefined,
        difficulty: difficulty || undefined,
      });
    } else {
      challenges = await getAllChallenges();
    }

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
