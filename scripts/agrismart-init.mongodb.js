const use = db.getSiblingDB

use("agrismart")

print("🔥 DROPPING EXISTING DATABASE...")

// Switch to agrismart database and drop it
db = use("agrismart")
db.dropDatabase()

print("✅ DATABASE DROPPED SUCCESSFULLY")
print("🚀 RECREATING DATABASE STRUCTURE...")

/* ---------------- USERS ---------------- */
db.createCollection("users")
db.users.createIndex({ email: 1 }, { unique: true })

const users = db.users.insertMany([
  {
    email: "admin@agrismart.com",
    password_hash: "$2a$10$8K1p/a0dL3.rGa2Qs6v5GOvjHW3oe/NxU.2qZ8rV5dD6mYN5Gf5.K",
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    email: "farmer1@example.com",
    password_hash: "$2a$10$8K1p/a0dL3.rGa2Qs6v5GOvjHW3oe/NxU.2qZ8rV5dD6mYN5Gf5.K",
    is_admin: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    email: "farmer2@example.com",
    password_hash: "$2a$10$8K1p/a0dL3.rGa2Qs6v5GOvjHW3oe/NxU.2qZ8rV5dD6mYN5Gf5.K",
    is_admin: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
])

const user1 = users.insertedIds[0]
const user2 = users.insertedIds[1]

/* ---------------- FARMERS ---------------- */
db.createCollection("farmers")
db.farmers.createIndex({ user_id: 1 }, { unique: true })
db.farmers.createIndex({ phone: 1 })
db.farmers.createIndex({ state: 1 })

db.farmers.insertMany([
  {
    user_id: user1,
    name: "Ramesh Kumar",
    phone: "9876543210",
    village: "Shirdi",
    district: "Ahmednagar",
    state: "Maharashtra",
    language: "mr",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user2,
    name: "Suresh Patil",
    phone: "9876543211",
    village: "Nashik Road",
    district: "Nashik",
    state: "Maharashtra",
    language: "mr",
    created_at: new Date(),
    updated_at: new Date(),
  },
])

/* ---------------- FIELDS ---------------- */
db.createCollection("fields")
db.fields.createIndex({ user_id: 1 })
db.fields.createIndex({ user_id: 1, name: 1 })

const fields = db.fields.insertMany([
  {
    user_id: user1,
    name: "North Field",
    area: 2.5,
    location: "Shirdi",
    soil_type: "Black",
    irrigation_type: "Drip",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user1,
    name: "South Field",
    area: 3.0,
    location: "Shirdi",
    soil_type: "Red",
    irrigation_type: "Sprinkler",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user2,
    name: "Main Farm",
    area: 5,
    location: "Nashik",
    soil_type: "Alluvial",
    irrigation_type: "Canal",
    created_at: new Date(),
    updated_at: new Date(),
  },
])

const field1 = fields.insertedIds[0]
const field2 = fields.insertedIds[1]
const field3 = fields.insertedIds[2]

/* ---------------- CROPS ---------------- */
db.createCollection("crops")
db.crops.createIndex({ name: 1 }, { unique: true })
db.crops.createIndex({ category: 1 })
db.crops.createIndex({ season: 1 })

const crops = db.crops.insertMany([
  { name: "Wheat", category: "cereal", season: "rabi", duration_days: 120 },
  { name: "Rice", category: "cereal", season: "kharif", duration_days: 120 },
  { name: "Cotton", category: "fiber", season: "kharif", duration_days: 180 },
  { name: "Sugarcane", category: "cash_crop", season: "annual", duration_days: 365 },
  { name: "Tomato", category: "vegetable", season: "all", duration_days: 90 },
  { name: "Potato", category: "vegetable", season: "rabi", duration_days: 90 },
  { name: "Onion", category: "vegetable", season: "rabi", duration_days: 120 },
  { name: "Corn", category: "cereal", season: "kharif", duration_days: 90 },
])

const wheat = crops.insertedIds[0]
const cotton = crops.insertedIds[2]
const sugarcane = crops.insertedIds[3]

/* ---------------- CROP CYCLES ---------------- */
db.createCollection("crop_cycles")
db.crop_cycles.createIndex({ user_id: 1 })
db.crop_cycles.createIndex({ field_id: 1 })
db.crop_cycles.createIndex({ status: 1 })

const cycles = db.crop_cycles.insertMany([
  {
    user_id: user1,
    field_id: field1,
    crop_id: wheat,
    crop_name: "Wheat",
    status: "growing",
    planting_date: new Date("2024-11-15"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user1,
    field_id: field2,
    crop_id: cotton,
    crop_name: "Cotton",
    status: "harvested",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user2,
    field_id: field3,
    crop_id: sugarcane,
    crop_name: "Sugarcane",
    status: "growing",
    created_at: new Date(),
    updated_at: new Date(),
  },
])

const cycle1 = cycles.insertedIds[0]

/* ---------------- FIELD ACTIVITIES ---------------- */
db.createCollection("field_activities")
db.field_activities.createIndex({ user_id: 1 })
db.field_activities.createIndex({ field_id: 1 })
db.field_activities.createIndex({ activity_type: 1 })

db.field_activities.insertMany([
  {
    user_id: user1,
    field_id: field1,
    crop_cycle_id: cycle1,
    activity_type: "sowing",
    date: new Date("2024-11-15"),
    cost: 3000,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: user1,
    field_id: field1,
    crop_cycle_id: cycle1,
    activity_type: "fertilizer",
    date: new Date("2024-11-25"),
    cost: 1200,
    created_at: new Date(),
    updated_at: new Date(),
  },
])

/* ---------------- SCHEMES ---------------- */
db.createCollection("schemes")
db.schemes.createIndex({ state: 1 })
db.schemes.createIndex({ category: 1 })
db.schemes.createIndex({ id: 1 }, { unique: true })

db.schemes.insertMany([
  {
    id: "SCM001",
    scheme_name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description:
      "Central sector income support scheme providing direct benefit transfer to small and marginal farmer families.",
    eligibility:
      "All small and marginal farmer families owning cultivable land as per land records of the concerned State/UT.",
    benefits: "₹6000 per year per farmer family in three equal four-monthly instalments.",
    application_process:
      "Farmers apply through state agriculture department, CSC centres, or are enrolled by revenue officials on PM-KISAN portal.",
    contact_info: "PM-KISAN Helpline: 155261 / 011-23381092, pmkisan-ict@gov.in",
    state: "All India",
    category: "income_support",
    is_active: true,
    created_at: new Date("2019-02-01"),
    budget_allocation: "₹75,000 crore",
    beneficiaries_count: 115000000,
    website_url: "https://pmkisan.gov.in",
  },
  {
    id: "SCM002",
    scheme_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Flagship crop insurance scheme to support sustainable production in agriculture.",
    eligibility: "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
    benefits: "Insurance coverage against yield losses due to non-preventable risks at subsidized premium rates.",
    application_process: "Enrollment through banks, insurance companies, or CSCs before cut-off dates.",
    contact_info: "PMFBY Helpline: 1800-180-1551",
    state: "All India",
    category: "insurance",
    is_active: true,
    created_at: new Date("2016-04-01"),
    budget_allocation: "₹15,000+ crore annually",
    beneficiaries_count: 50000000,
    website_url: "https://pmfby.gov.in",
  },
  {
    id: "SCM003",
    scheme_name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "Scheme to expand cultivable area under assured irrigation.",
    eligibility: "Farmers and water user associations in approved irrigation projects.",
    benefits: "Funding for micro-irrigation, field channels, water harvesting and on-farm water management.",
    application_process: "Apply through state agriculture or irrigation departments.",
    contact_info: "State Agriculture/Irrigation Department",
    state: "All India",
    category: "irrigation",
    is_active: true,
    created_at: new Date("2015-07-01"),
    budget_allocation: "₹50,000 crore",
    website_url: "https://pmksy.gov.in",
  },
  {
    id: "SCM004",
    scheme_name: "Soil Health Card Scheme",
    description: "Scheme for issuing soil health cards to farmers with crop-wise nutrient recommendations.",
    eligibility: "All farmers whose soil samples are collected under the scheme.",
    benefits: "Free soil testing and soil health card with fertilizer recommendations.",
    application_process: "Soil samples collected by agriculture department; farmers receive cards from local office.",
    contact_info: "Local Agriculture Department / Krishi Vigyan Kendra",
    state: "All India",
    category: "soil_health",
    is_active: true,
    created_at: new Date("2015-02-19"),
    beneficiaries_count: 220000000,
    website_url: "https://soilhealth.dac.gov.in",
  },
  {
    id: "SCM005",
    scheme_name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Organic farming promotion scheme.",
    eligibility: "Farmer groups of 50 or more farmers willing to adopt organic farming on at least 50 acres.",
    benefits: "Financial assistance for organic inputs, certification, training and marketing.",
    application_process: "Farmer groups apply through state agriculture departments.",
    contact_info: "State Nodal Officer, PKVY",
    state: "All India",
    category: "organic_farming",
    is_active: true,
    created_at: new Date("2015-04-01"),
    budget_allocation: "₹3,000 crore",
    website_url: "https://pkvy.nic.in",
  },
])

/* ---------------- OTHER COLLECTIONS ---------------- */
db.createCollection("disease_reports")
db.disease_reports.createIndex({ user_id: 1 })
db.disease_reports.createIndex({ reported_date: -1 })

db.createCollection("soil_analysis")
db.soil_analysis.createIndex({ field_id: 1 })
db.soil_analysis.createIndex({ user_id: 1 })

db.createCollection("weather_data")
db.weather_data.createIndex({ location: 1, date: -1 })

db.createCollection("market_prices")
db.market_prices.createIndex({ commodity: 1, date: -1 })
db.market_prices.createIndex({ state: 1 })

db.createCollection("encyclopedia")
db.encyclopedia.createIndex({ title: 1 })
db.encyclopedia.createIndex({ category: 1 })

print("✅ DATABASE INITIALIZATION COMPLETE")
print("📊 Collections created with indexes")
print("👥 Sample users, farmers, fields, crops, and schemes added")
