import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_VISION_API_KEY

    if (!apiKey) {
      // Return sample analysis if API key not configured
      return NextResponse.json({
        success: true,
        disease: "Early Blight",
        confidence: 0.87,
        severity: "moderate",
        recommendations: {
          en: [
            "Remove affected leaves",
            "Apply fungicide (copper-based)",
            "Improve air circulation",
            "Reduce leaf wetness",
          ],
          hi: ["प्रभावित पत्तियों को हटाएं", "कवकनाशी (तांबा-आधारित) लगाएं", "हवा का संचार सुधारें", "पत्तियों की नमी कम करें"],
          mr: ["प्रभावित पाने काढून टाका", "बुरशीनाशक (तांबे-आधारित) वापरा", "हवेचा प्रवाह सुधारा", "पानांची ओलसरपणा कमी करा"],
        },
        message: "Sample analysis - configure GOOGLE_VISION_API_KEY for real AI detection",
      })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // Google Cloud Vision API call
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "LABEL_DETECTION", maxResults: 10 }, { type: "IMAGE_PROPERTIES" }],
          },
        ],
      }),
    })

    const data = await response.json()

    // Process AI results and map to disease detection
    // This is a simplified version - real implementation would use trained models

    return NextResponse.json({
      success: true,
      data,
      message: "AI-powered disease detection",
    })
  } catch (error) {
    console.error("Disease Detection API Error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
