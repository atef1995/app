import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🧪 Test webhook endpoint called");
  
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log("📥 Received data:", {
      method: request.method,
      url: request.url,
      bodyLength: body.length,
      headers: headers,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Test webhook received",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Test webhook error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Test webhook failed" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log("🧪 Test webhook GET endpoint called");
  
  return NextResponse.json({ 
    success: true, 
    message: "Test webhook endpoint is working",
    timestamp: new Date().toISOString(),
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
}