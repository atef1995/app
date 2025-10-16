import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const isPremium = searchParams.get("isPremium");

    // Build filter object
    const where: Prisma.CheatSheetWhereInput = {
      published: true,
    };

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      where.category = category;
    }

    // Difficulty filter
    if (difficulty && difficulty !== "all") {
      where.difficulty = difficulty;
    }

    // Premium filter
    if (isPremium === "true") {
      where.isPremium = true;
    } else if (isPremium === "false") {
      where.isPremium = false;
    }

    // Get total count
    const total = await prisma.cheatSheet.count({ where });

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch cheat sheets
    const cheatSheets = await prisma.cheatSheet.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isPremium: "desc" }, { order: "asc" }],
    });

    // Increment view count for each sheet
    for (const sheet of cheatSheets) {
      await prisma.cheatSheet.update({
        where: { id: sheet.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      data: cheatSheets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cheat sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch cheat sheets" },
      { status: 500 }
    );
  }
}
