import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CertificateService } from "@/lib/certificateService";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { certificateId, isPublic } = body;

    if (!certificateId || typeof isPublic !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Certificate ID and isPublic boolean are required" },
        { status: 400 }
      );
    }

    const certificate = await CertificateService.updateCertificatePublicity(
      certificateId,
      session.user.id,
      isPublic
    );

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}