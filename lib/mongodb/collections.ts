import { ObjectId } from "mongodb"
import { getDatabase } from "./client"
import type { MongoUser } from "./types"

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  FARMERS: "farmers",
  FIELDS: "fields",
  CROP_CYCLES: "crop_cycles",
  FIELD_ACTIVITIES: "field_activities",
  CROPS: "crops",
  SCHEMES: "schemes",
  SOIL_ANALYSIS: "soil_analysis",
  WEATHER_DATA: "weather_data",
  MARKET_PRICES: "market_prices",
  DISEASE_REPORTS: "disease_reports",
  ENCYCLOPEDIA: "encyclopedia",
  CROPSAP_ALERTS: "cropsap_alerts",
  SCHEME_CATEGORIES: "scheme_categories",
  CROP_CATEGORIES: "crop_categories",
} as const

// Helper to get a collection
export async function getCollection(name: string) {
  const db = await getDatabase()
  return db.collection(name)
}

// Initialize collections with indexes
export async function initializeCollections() {
  const db = await getDatabase()

  // Users collection
  await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })

  // Farmers collection
  await db.collection(COLLECTIONS.FARMERS).createIndex({ user_id: 1 }, { unique: true })
  await db.collection(COLLECTIONS.FARMERS).createIndex({ phone: 1 })

  // Fields collection
  await db.collection(COLLECTIONS.FIELDS).createIndex({ farmer_id: 1 })

  // Crop cycles collection
  await db.collection(COLLECTIONS.CROP_CYCLES).createIndex({ field_id: 1 })
  await db.collection(COLLECTIONS.CROP_CYCLES).createIndex({ farmer_id: 1 })

  // Market prices collection
  await db.collection(COLLECTIONS.MARKET_PRICES).createIndex({ commodity: 1, date: -1 })

  console.log("MongoDB collections initialized with indexes")
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const usersCollection = await getCollection(COLLECTIONS.USERS)
  const user = await usersCollection.findOne<MongoUser>({ _id: new ObjectId(userId) })
  return user?.is_admin === true
}
