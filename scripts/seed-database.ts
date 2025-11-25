// Database seed script for MongoDB
// Run this script to initialize the database with sample data

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || "agrismart"

async function seedDatabase() {
  console.log("Connecting to MongoDB...")
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db(MONGODB_DB)
    console.log("Connected to MongoDB!")

    // 1. Seed Crops Encyclopedia
    console.log("Seeding crops encyclopedia...")
    const cropsCollection = db.collection("crops")
    await cropsCollection.deleteMany({})

    const crops = [
      {
        crop_name: "Rice",
        scientific_name: "Oryza sativa",
        description:
          "Rice is a staple food crop grown in flooded fields. It is the primary food source for more than half of the world's population.",
        planting_season: "June-July (Kharif)",
        harvest_time: "October-November",
        water_requirements: "High - requires 1200-1500mm water",
        soil_type: "Clay loam, well-drained",
        fertilizer_needs: "NPK 120:60:40 kg/ha",
        common_diseases: ["Blast", "Brown Spot", "Bacterial Leaf Blight"],
        prevention_tips: ["Use resistant varieties", "Proper water management", "Seed treatment"],
        created_at: new Date(),
      },
      {
        crop_name: "Wheat",
        scientific_name: "Triticum aestivum",
        description: "Wheat is a major cereal grain crop used for making flour, bread, and other food products.",
        planting_season: "October-November (Rabi)",
        harvest_time: "March-April",
        water_requirements: "Medium - requires 450-650mm water",
        soil_type: "Loamy soil, well-drained",
        fertilizer_needs: "NPK 120:60:40 kg/ha",
        common_diseases: ["Rust", "Powdery Mildew", "Karnal Bunt"],
        prevention_tips: ["Timely sowing", "Use certified seeds", "Crop rotation"],
        created_at: new Date(),
      },
      {
        crop_name: "Maize",
        scientific_name: "Zea mays",
        description: "Maize or corn is a versatile crop used for food, feed, and industrial purposes.",
        planting_season: "June-July (Kharif) or February-March (Rabi)",
        harvest_time: "90-120 days after sowing",
        water_requirements: "Medium - requires 500-800mm water",
        soil_type: "Sandy loam to clay loam",
        fertilizer_needs: "NPK 120:60:40 kg/ha",
        common_diseases: ["Maize Stalk Rot", "Leaf Blight", "Downy Mildew"],
        prevention_tips: ["Seed treatment", "Proper spacing", "Balanced fertilization"],
        created_at: new Date(),
      },
      {
        crop_name: "Cotton",
        scientific_name: "Gossypium hirsutum",
        description: "Cotton is a major fiber crop grown for textile industry. It is also called white gold.",
        planting_season: "April-May",
        harvest_time: "October-December",
        water_requirements: "Medium - requires 700-1200mm water",
        soil_type: "Black cotton soil, deep alluvial",
        fertilizer_needs: "NPK 100:50:50 kg/ha",
        common_diseases: ["Bollworm", "Whitefly", "Root Rot"],
        prevention_tips: ["IPM practices", "Bt cotton varieties", "Proper irrigation"],
        created_at: new Date(),
      },
      {
        crop_name: "Sugarcane",
        scientific_name: "Saccharum officinarum",
        description: "Sugarcane is a tall perennial grass grown for sugar production and biofuel.",
        planting_season: "October-November or February-March",
        harvest_time: "12-18 months after planting",
        water_requirements: "High - requires 1500-2500mm water",
        soil_type: "Deep, well-drained loamy soil",
        fertilizer_needs: "NPK 250:100:100 kg/ha",
        common_diseases: ["Red Rot", "Smut", "Grassy Shoot"],
        prevention_tips: ["Disease-free seed cane", "Proper drainage", "Ratoon management"],
        created_at: new Date(),
      },
      {
        crop_name: "Tomato",
        scientific_name: "Solanum lycopersicum",
        description: "Tomato is a popular vegetable crop rich in vitamins and antioxidants.",
        planting_season: "Year-round (protected cultivation)",
        harvest_time: "60-90 days after transplanting",
        water_requirements: "Medium - requires 400-600mm water",
        soil_type: "Sandy loam, pH 6.0-7.0",
        fertilizer_needs: "NPK 120:60:60 kg/ha",
        common_diseases: ["Early Blight", "Late Blight", "Leaf Curl"],
        prevention_tips: ["Stake plants", "Mulching", "Resistant varieties"],
        created_at: new Date(),
      },
      {
        crop_name: "Potato",
        scientific_name: "Solanum tuberosum",
        description: "Potato is a major vegetable and tuber crop grown worldwide for food.",
        planting_season: "October-November (Rabi)",
        harvest_time: "90-120 days after planting",
        water_requirements: "Medium - requires 500-700mm water",
        soil_type: "Sandy loam, loose and friable",
        fertilizer_needs: "NPK 180:80:100 kg/ha",
        common_diseases: ["Late Blight", "Early Blight", "Black Scurf"],
        prevention_tips: ["Certified seed tubers", "Proper hilling", "Crop rotation"],
        created_at: new Date(),
      },
      {
        crop_name: "Onion",
        scientific_name: "Allium cepa",
        description: "Onion is a bulb vegetable used worldwide for culinary purposes.",
        planting_season: "October-November (Rabi) or June-July (Kharif)",
        harvest_time: "120-150 days after transplanting",
        water_requirements: "Medium - requires 350-550mm water",
        soil_type: "Sandy loam to clay loam",
        fertilizer_needs: "NPK 100:50:50 kg/ha",
        common_diseases: ["Purple Blotch", "Downy Mildew", "Thrips"],
        prevention_tips: ["Proper curing", "Storage management", "Fungicide spray"],
        created_at: new Date(),
      },
    ]

    await cropsCollection.insertMany(crops)
    console.log(`Inserted ${crops.length} crops`)

    // 2. Seed Market Prices
    console.log("Seeding market prices...")
    const pricesCollection = db.collection("market_prices")
    await pricesCollection.deleteMany({})

    const prices = [
      {
        crop: "Rice",
        cropHi: "चावल",
        price: 3200,
        unit: "per quintal",
        trend: "up",
        change: 2.5,
        market: "Delhi Mandi",
        state: "Delhi",
        lastUpdated: new Date(),
      },
      {
        crop: "Wheat",
        cropHi: "गेहूं",
        price: 2150,
        unit: "per quintal",
        trend: "up",
        change: 1.8,
        market: "Punjab Mandi",
        state: "Punjab",
        lastUpdated: new Date(),
      },
      {
        crop: "Maize",
        cropHi: "मक्का",
        price: 1800,
        unit: "per quintal",
        trend: "down",
        change: -1.2,
        market: "UP Mandi",
        state: "Uttar Pradesh",
        lastUpdated: new Date(),
      },
      {
        crop: "Cotton",
        cropHi: "कपास",
        price: 5600,
        unit: "per quintal",
        trend: "up",
        change: 3.2,
        market: "Gujarat Mandi",
        state: "Gujarat",
        lastUpdated: new Date(),
      },
      {
        crop: "Sugarcane",
        cropHi: "गन्ना",
        price: 350,
        unit: "per quintal",
        trend: "up",
        change: 0.8,
        market: "Maharashtra Mandi",
        state: "Maharashtra",
        lastUpdated: new Date(),
      },
      {
        crop: "Tomato",
        cropHi: "टमाटर",
        price: 4500,
        unit: "per quintal",
        trend: "down",
        change: -5.2,
        market: "Karnataka Mandi",
        state: "Karnataka",
        lastUpdated: new Date(),
      },
      {
        crop: "Potato",
        cropHi: "आलू",
        price: 1200,
        unit: "per quintal",
        trend: "up",
        change: 1.5,
        market: "UP Mandi",
        state: "Uttar Pradesh",
        lastUpdated: new Date(),
      },
      {
        crop: "Onion",
        cropHi: "प्याज",
        price: 2800,
        unit: "per quintal",
        trend: "down",
        change: -2.8,
        market: "Nashik Mandi",
        state: "Maharashtra",
        lastUpdated: new Date(),
      },
      {
        crop: "Soybean",
        cropHi: "सोयाबीन",
        price: 4200,
        unit: "per quintal",
        trend: "up",
        change: 2.1,
        market: "MP Mandi",
        state: "Madhya Pradesh",
        lastUpdated: new Date(),
      },
      {
        crop: "Groundnut",
        cropHi: "मूंगफली",
        price: 5100,
        unit: "per quintal",
        trend: "up",
        change: 1.9,
        market: "Gujarat Mandi",
        state: "Gujarat",
        lastUpdated: new Date(),
      },
    ]

    await pricesCollection.insertMany(prices)
    console.log(`Inserted ${prices.length} market prices`)

    // 3. Seed Government Schemes
    console.log("Seeding government schemes...")
    const schemesCollection = db.collection("schemes")
    await schemesCollection.deleteMany({})

    const schemes = [
      {
        name: "PM-KISAN",
        nameHi: "प्रधानमंत्री किसान सम्मान निधि",
        description: "Direct income support of Rs. 6000 per year to farmer families",
        descriptionHi: "किसान परिवारों को प्रति वर्ष 6000 रुपये की प्रत्यक्ष आय सहायता",
        eligibility: "All landholding farmer families",
        benefits: "Rs. 6000 per year in 3 installments",
        documents: ["Aadhaar Card", "Land Records", "Bank Account"],
        applicationUrl: "https://pmkisan.gov.in",
        category: "Income Support",
        active: true,
        created_at: new Date(),
      },
      {
        name: "PM Fasal Bima Yojana",
        nameHi: "प्रधानमंत्री फसल बीमा योजना",
        description: "Crop insurance scheme to protect farmers against crop loss",
        descriptionHi: "फसल हानि से किसानों की सुरक्षा के लिए फसल बीमा योजना",
        eligibility: "All farmers growing notified crops",
        benefits: "Insurance coverage for crop damage due to natural calamities",
        documents: ["Land Records", "Aadhaar Card", "Bank Details", "Sowing Certificate"],
        applicationUrl: "https://pmfby.gov.in",
        category: "Insurance",
        active: true,
        created_at: new Date(),
      },
      {
        name: "Kisan Credit Card",
        nameHi: "किसान क्रेडिट कार्ड",
        description: "Credit facility for farmers at subsidized interest rates",
        descriptionHi: "किसानों को रियायती ब्याज दरों पर ऋण सुविधा",
        eligibility: "All farmers, sharecroppers, tenant farmers",
        benefits: "Up to Rs. 3 lakh at 4% interest rate",
        documents: ["Identity Proof", "Land Records", "Passport Photo"],
        applicationUrl: "https://www.nabard.org",
        category: "Credit",
        active: true,
        created_at: new Date(),
      },
      {
        name: "Soil Health Card Scheme",
        nameHi: "मृदा स्वास्थ्य कार्ड योजना",
        description: "Free soil testing and recommendations for farmers",
        descriptionHi: "किसानों के लिए मुफ्त मिट्टी परीक्षण और सिफारिशें",
        eligibility: "All farmers",
        benefits: "Free soil health card with fertilizer recommendations",
        documents: ["Aadhaar Card", "Land Details"],
        applicationUrl: "https://soilhealth.dac.gov.in",
        category: "Soil Health",
        active: true,
        created_at: new Date(),
      },
      {
        name: "PM Krishi Sinchai Yojana",
        nameHi: "प्रधानमंत्री कृषि सिंचाई योजना",
        description: "Scheme to expand irrigation coverage and improve water use efficiency",
        descriptionHi: "सिंचाई कवरेज बढ़ाने और जल उपयोग दक्षता में सुधार की योजना",
        eligibility: "All farmers with agricultural land",
        benefits: "Subsidy on micro-irrigation systems",
        documents: ["Land Records", "Aadhaar Card", "Bank Details"],
        applicationUrl: "https://pmksy.gov.in",
        category: "Irrigation",
        active: true,
        created_at: new Date(),
      },
    ]

    await schemesCollection.insertMany(schemes)
    console.log(`Inserted ${schemes.length} schemes`)

    // 4. Create indexes
    console.log("Creating indexes...")
    await cropsCollection.createIndex({ crop_name: 1 })
    await pricesCollection.createIndex({ crop: 1, state: 1 })
    await schemesCollection.createIndex({ category: 1, active: 1 })

    // Users collection indexes
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })

    // Farmers collection indexes
    const farmersCollection = db.collection("farmers")
    await farmersCollection.createIndex({ user_id: 1 })

    // Fields collection indexes
    const fieldsCollection = db.collection("fields")
    await fieldsCollection.createIndex({ user_id: 1 })

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  } finally {
    await client.close()
    console.log("Connection closed.")
  }
}

seedDatabase()
