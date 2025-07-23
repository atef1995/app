import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, title, description, data } = await request.json();

    // Validate required fields
    if (!type || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, description" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create progress share entry
    const progressShare = await prisma.progressShare.create({
      data: {
        userId: user.id,
        type,
        title,
        description,
        data: data || {},
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      progressShare,
    });
  } catch (error) {
    console.error("Error creating progress share:", error);
    return NextResponse.json(
      { error: "Failed to create progress share" },
      { status: 500 }
    );
  }
}
