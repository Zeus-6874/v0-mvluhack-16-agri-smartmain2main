import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message, language = "en" } = body

    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message required" }, { status: 400 })
    }

    const authKey = process.env.MSG91_AUTH_KEY

    if (!authKey) {
      return NextResponse.json({
        success: false,
        message: "SMS service not configured - configure MSG91_AUTH_KEY",
        demo: true,
      })
    }

    // MSG91 API call
    const response = await fetch("https://api.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: authKey,
      },
      body: JSON.stringify({
        flow_id: process.env.MSG91_TEMPLATE_ID,
        sender: "AGRISM",
        mobiles: phone,
        message: message,
      }),
    })

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data,
      message: "SMS sent successfully",
    })
  } catch (error) {
    console.error("SMS API Error:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}
