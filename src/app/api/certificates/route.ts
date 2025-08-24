import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CertificateService } from "@/lib/certificateService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    const certificates = await CertificateService.getUserCertificates(
      session.user.id,
      type as any
    );

    return NextResponse.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}