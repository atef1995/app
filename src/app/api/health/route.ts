import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health - Health check endpoint for monitoring
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    const endTime = Date.now();
    const dbResponseTime = endTime - startTime;
    
    // Basic health metrics
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: "connected",
        responseTime: `${dbResponseTime}ms`,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: "MB",
      },
      version: process.env.npm_package_version || "unknown",
    };
    
    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    
    const errorResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
    
    return NextResponse.json(errorResponse, { status: 503 });
  }
}

// HEAD request for simple ping
export async function HEAD() {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
