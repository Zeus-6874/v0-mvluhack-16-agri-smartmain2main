// MongoDB Database Initialization Script
// Run this script to set up all required collections with sample data

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || "agrismart"

async function initializeDatabase() {
  console.log("[v0] Connecting to MongoDB...")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("[v0] Connected to MongoDB successfully")

    const db = client.db(MONGODB_DB)

    // Create collections with indexes
    console.log("[v0] Creating collections and indexes...")

    // Users collection
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    console.log("[v0] Created users collection with email index")

    // Farmers collection
    const farmersCollection = db.collection("farmers")
    await farmersCollection.createIndex({ user_id: 1 }, { unique: true })
    console.log("[v0] Created farmers collection with user_id index")

    // Fields collection
    const fieldsCollection = db.collection("fields")
    await fieldsCollection.createIndex({ user_id: 1 })
    await fieldsCollection.createIndex({ user_id: 1, name: 1 })
    console.log("[v0] Created fields collection with indexes")

    // Crops collection (master data)
    const cropsCollection = db.collection("crops")
    await cropsCollection.createIndex({ name: 1 })
    await cropsCollection.createIndex({ category: 1 })

    // Insert sample crops if empty
    const cropsCount = await cropsCollection.countDocuments()
    if (cropsCount === 0) {
      await cropsCollection.insertMany([
        { name: "Wheat", name_hi: "गेहूं", name_mr: "गहू", category: "cereal", season: "rabi", duration_days: 120 },
        { name: "Rice", name_hi: "चावल", name_mr: "तांदूळ", category: "cereal", season: "kharif", duration_days: 120 },
        { name: "Corn", name_hi: "मक्का", name_mr: "मका", category: "cereal", season: "kharif", duration_days: 90 },
        { name: "Cotton", name_hi: "कपास", name_mr: "कापूस", category: "fiber", season: "kharif", duration_days: 180 },
        { name: "Sugarcane", name_hi: "गन्ना", name_mr: "ऊस", category: "cash", season: "annual", duration_days: 365 },
        { name: "Tomato", name_hi: "टमाटर", name_mr: "टोमॅटो", category: "vegetable", season: "all", duration_days: 90 },
        { name: "Onion", name_hi: "प्याज", name_mr: "कांदा", category: "vegetable", season: "rabi", duration_days: 120 },
        { name: "Potato", name_hi: "आलू", name_mr: "बटाटा", category: "vegetable", season: "rabi", duration_days: 90 },
        {
          name: "Soybean",
          name_hi: "सोयाबीन",
          name_mr: "सोयाबीन",
          category: "oilseed",
          season: "kharif",
          duration_days: 100,
        },
        {
          name: "Groundnut",
          name_hi: "मूंगफली",
          name_mr: "भुईमूग",
          category: "oilseed",
          season: "kharif",
          duration_days: 120,
        },
      ])
      console.log("[v0] Inserted sample crops data")
    }

    // Market Prices collection
    const pricesCollection = db.collection("market_prices")
    await pricesCollection.createIndex({ crop: 1, state: 1 })
    await pricesCollection.createIndex({ date: -1 })

    // Insert sample market prices if empty
    const pricesCount = await pricesCollection.countDocuments()
    if (pricesCount === 0) {
      const today = new Date()
      await pricesCollection.insertMany([
        { crop: "Wheat", state: "Maharashtra", price: 2200, unit: "quintal", date: today, change: 2.5 },
        { crop: "Rice", state: "Maharashtra", price: 2800, unit: "quintal", date: today, change: -1.2 },
        { crop: "Cotton", state: "Maharashtra", price: 6500, unit: "quintal", date: today, change: 3.8 },
        { crop: "Soybean", state: "Maharashtra", price: 4200, unit: "quintal", date: today, change: 1.5 },
        { crop: "Onion", state: "Maharashtra", price: 1800, unit: "quintal", date: today, change: -5.2 },
        { crop: "Tomato", state: "Maharashtra", price: 2500, unit: "quintal", date: today, change: 8.3 },
      ])
      console.log("[v0] Inserted sample market prices data")
    }

    // Schemes collection
    const schemesCollection = db.collection("schemes")
    await schemesCollection.createIndex({ state: 1 })
    await schemesCollection.createIndex({ category: 1 })

    // Insert sample schemes if empty
    const schemesCount = await schemesCollection.countDocuments()
    if (schemesCount === 0) {
      await schemesCollection.insertMany([
        {
          name: "PM-KISAN",
          name_hi: "पीएम-किसान",
          description: "Income support of Rs 6000 per year to farmer families",
          description_hi: "किसान परिवारों को प्रति वर्ष 6000 रुपये की आय सहायता",
          category: "income_support",
          state: "all",
          eligibility: "Small and marginal farmers",
          benefits: "Rs 6000 per year in 3 installments",
          link: "https://pmkisan.gov.in",
        },
        {
          name: "Pradhan Mantri Fasal Bima Yojana",
          name_hi: "प्रधानमंत्री फसल बीमा योजना",
          description: "Crop insurance scheme for farmers",
          description_hi: "किसानों के लिए फसल बीमा योजना",
          category: "insurance",
          state: "all",
          eligibility: "All farmers growing notified crops",
          benefits: "Insurance coverage for crop loss",
          link: "https://pmfby.gov.in",
        },
        {
          name: "Kisan Credit Card",
          name_hi: "किसान क्रेडिट कार्ड",
          description: "Credit facility for farmers",
          description_hi: "किसानों के लिए ऋण सुविधा",
          category: "credit",
          state: "all",
          eligibility: "All farmers",
          benefits: "Low interest loans up to Rs 3 lakh",
          link: "https://www.nabard.org",
        },
      ])
      console.log("[v0] Inserted sample schemes data")
    }

    // Crop Cycles collection
    const cropCyclesCollection = db.collection("crop_cycles")
    await cropCyclesCollection.createIndex({ user_id: 1 })
    await cropCyclesCollection.createIndex({ field_id: 1 })
    await cropCyclesCollection.createIndex({ status: 1 })
    console.log("[v0] Created crop_cycles collection with indexes")

    // Field Activities collection
    const activitiesCollection = db.collection("field_activities")
    await activitiesCollection.createIndex({ user_id: 1 })
    await activitiesCollection.createIndex({ field_id: 1 })
    await activitiesCollection.createIndex({ date: -1 })
    console.log("[v0] Created field_activities collection with indexes")

    // Encyclopedia collection
    const encyclopediaCollection = db.collection("encyclopedia")
    await encyclopediaCollection.createIndex({ category: 1 })
    await encyclopediaCollection.createIndex({ tags: 1 })

    // Insert sample encyclopedia entries if empty
    const encyclopediaCount = await encyclopediaCollection.countDocuments()
    if (encyclopediaCount === 0) {
      await encyclopediaCollection.insertMany([
        {
          title: "Organic Farming Basics",
          title_hi: "जैविक खेती की मूल बातें",
          category: "farming_methods",
          content: "Organic farming is a method of crop production that avoids synthetic fertilizers and pesticides...",
          content_hi: "जैविक खेती फसल उत्पादन की एक विधि है जो सिंथेटिक उर्वरकों और कीटनाशकों से बचती है...",
          tags: ["organic", "sustainable", "beginner"],
        },
        {
          title: "Drip Irrigation Guide",
          title_hi: "ड्रिप सिंचाई गाइड",
          category: "irrigation",
          content: "Drip irrigation is a water-efficient method that delivers water directly to plant roots...",
          content_hi: "ड्रिप सिंचाई एक जल-कुशल विधि है जो पानी सीधे पौधों की जड़ों तक पहुंचाती है...",
          tags: ["irrigation", "water_saving", "technology"],
        },
        {
          title: "Common Wheat Diseases",
          title_hi: "गेहूं के सामान्य रोग",
          category: "diseases",
          content: "Learn about common wheat diseases like rust, smut, and their management...",
          content_hi: "गेहूं के सामान्य रोगों जैसे रतुआ, कंडुआ और उनके प्रबंधन के बारे में जानें...",
          tags: ["wheat", "diseases", "management"],
        },
      ])
      console.log("[v0] Inserted sample encyclopedia data")
    }

    console.log("[v0] Database initialization complete!")
    console.log(
      "[v0] Collections created: users, farmers, fields, crops, market_prices, schemes, crop_cycles, field_activities, encyclopedia",
    )
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
    throw error
  } finally {
    await client.close()
    console.log("[v0] MongoDB connection closed")
  }
}

// Run the initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
