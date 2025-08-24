import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CertificateService } from "@/lib/certificateService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, entityId, metadata } = body;

    if (!type || !entityId) {
      return NextResponse.json(
        { success: false, error: "Type and entityId are required" },
        { status: 400 }
      );
    }

    let certificate = null;

    if (type === "TUTORIAL") {
      if (!metadata) {
        return NextResponse.json(
          { success: false, error: "Metadata is required for tutorial certificates" },
          { status: 400 }
        );
      }
      
      certificate = await CertificateService.generateTutorialCertificate(
        session.user.id,
        entityId,
        metadata
      );
    } else if (type === "CATEGORY") {
      certificate = await CertificateService.generateCategoryCertificate(
        session.user.id,
        entityId
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid certificate type" },
        { status: 400 }
      );
    }

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "Failed to generate certificate or not eligible" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}