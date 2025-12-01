import type { ObjectId } from "mongodb"

// Base MongoDB document with _id
export interface MongoDocument {
  _id: ObjectId
  created_at?: Date
  updated_at?: Date
}

// User types
export interface MongoUser extends MongoDocument {
  email: string
  password_hash: string
  is_admin?: boolean
}

// Farmer/Profile types
export interface MongoFarmer extends MongoDocument {
  user_id: string
  name: string
  phone?: string
  village?: string
  district?: string
  state?: string
  language?: string
}

// Field types
export interface MongoField extends MongoDocument {
  farmer_id: string
  field_name: string
  location: string
  area: number
  area_unit: string
  soil_type?: string
  irrigation_type?: string
}

// Crop Cycle types
export interface MongoCropCycle extends MongoDocument {
  farmer_id: string
  field_id: string
  crop_name: string
  variety?: string
  planting_date: Date
  expected_harvest_date: Date
  actual_harvest_date?: Date
  status: "planning" | "planted" | "growing" | "harvested" | "failed"
  yield_quantity?: number
  yield_unit?: string
}

// Field Activity types
export interface MongoFieldActivity extends MongoDocument {
  crop_cycle_id: string
  activity_type: string
  activity_date: Date
  description?: string
  quantity?: number
  unit?: string
  cost?: number
}

// Crop types
export interface MongoCrop extends MongoDocument {
  crop_name: string
  crop_name_hi?: string
  crop_name_mr?: string
  scientific_name?: string
  family?: string
  description?: string
  description_hi?: string
  description_mr?: string
  growing_season?: string
  climate?: string
  soil_type?: string
  water_requirement?: string
  photo_url?: string
}

// Scheme types
export interface MongoScheme extends MongoDocument {
  scheme_name: string
  scheme_name_hi?: string
  scheme_name_mr?: string
  description: string
  description_hi?: string
  description_mr?: string
  eligibility?: string
  eligibility_hi?: string
  eligibility_mr?: string
  benefits?: string
  benefits_hi?: string
  benefits_mr?: string
  how_to_apply?: string
  how_to_apply_hi?: string
  how_to_apply_mr?: string
  contact_info?: string
  state?: string
  category?: string
  website_url?: string
}

// Disease Report types
export interface MongoDiseaseReport extends MongoDocument {
  farmer_id: string
  crop_name: string
  disease_name: string
  confidence: number
  symptoms?: string[]
  treatment?: string[]
  prevention?: string[]
  image_url?: string
  reported_date: Date
  location?: string
}

// Weather Data types
export interface MongoWeatherData extends MongoDocument {
  location: string
  date: Date
  temperature: number
  humidity: number
  precipitation: number
  wind_speed?: number
  condition: string
}

// Market Price types
export interface MongoMarketPrice extends MongoDocument {
  commodity: string
  variety?: string
  market: string
  state?: string
  min_price: number
  max_price: number
  modal_price: number
  date: Date
  lastUpdated: Date
}

// Soil Analysis types
export interface MongoSoilAnalysis extends MongoDocument {
  field_id: string
  farmer_id: string
  test_date: Date
  ph_level?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  organic_matter?: number
  recommendations?: string
}

// Encyclopedia types (same as MongoCrop but separate collection)
export type MongoEncyclopedia = MongoCrop

// CropsAP Alert types
export interface MongoCropsAPAlert extends MongoDocument {
  crop: string
  pest_disease: string
  severity: string
  advisory: string
  reported_on: Date
  district?: string
  state?: string
}

// Category types
export interface MongoSchemeCategory extends MongoDocument {
  name: string
  name_hi?: string
  name_mr?: string
}

export interface MongoCropCategory extends MongoDocument {
  name: string
  name_hi?: string
  name_mr?: string
}

// Helper type to convert MongoDB document to API response
export type ApiDocument<T extends MongoDocument> = Omit<T, "_id"> & { id: string }

// Helper function to convert MongoDB document to API format
export function toApiFormat<T extends MongoDocument>(doc: T): ApiDocument<T> {
  const { _id, ...rest } = doc
  return { ...rest, id: _id.toString() } as ApiDocument<T>
}

// Helper function to convert multiple MongoDB documents to API format
export function toApiFormatArray<T extends MongoDocument>(docs: T[]): ApiDocument<T>[] {
  return docs.map(toApiFormat)
}
