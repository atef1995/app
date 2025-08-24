import { NextRequest, NextResponse } from "next/server";
import { CertificateService } from "@/lib/certificateService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareableId: string }> }
) {
  try {
    const { shareableId } = await params;

    const certificate = await CertificateService.getShareableCertificate(shareableId);

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (!certificate.isPublic) {
      return NextResponse.json(
        { success: false, error: "Certificate is not public" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error fetching shareable certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}