import type { ObjectId } from "mongodb"

export type MongoUser = {
  _id: ObjectId
  email: string
  password_hash: string
  is_admin?: boolean
  created_at?: Date
  updated_at?: Date
}

export type MongoFarmer = {
  _id: ObjectId
  user_id: ObjectId
  name: string
  phone?: string
  village?: string
  district?: string
  state?: string
  language?: string
  created_at?: Date
  updated_at?: Date
}

export type MongoField = {
  _id: ObjectId
  user_id: ObjectId
  name: string
  area: number
  location?: string
  soil_type?: string
  irrigation_type?: string
  created_at?: Date
  updated_at?: Date
}

export type MongoCropCycle = {
  _id: ObjectId
  user_id: ObjectId
  field_id: ObjectId
  crop_id?: ObjectId
  crop_name: string
  status: "planning" | "planted" | "growing" | "harvested" | "failed"
  planting_date?: Date
  expected_harvest_date?: Date
  actual_harvest_date?: Date
  variety?: string
  notes?: string
  yield_quantity?: number
  yield_unit?: string
  created_at?: Date
  updated_at?: Date
}

export type MongoFieldActivity = {
  _id: ObjectId
  user_id: ObjectId
  field_id: ObjectId
  crop_cycle_id?: ObjectId
  activity_type: string
  date: Date
  description?: string
  quantity?: number
  unit?: string
  cost?: number
  created_at?: Date
  updated_at?: Date
}

export type MongoCrop = {
  _id: ObjectId
  name: string
  category?: string
  season?: string
  duration_days?: number
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
  created_at?: Date
  updated_at?: Date
}

export type MongoScheme = {
  _id: ObjectId
  id?: string
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
  application_process?: string
  how_to_apply?: string
  how_to_apply_hi?: string
  how_to_apply_mr?: string
  contact_info?: string
  state?: string
  category?: string
  website_url?: string
  is_active?: boolean
  budget_allocation?: string
  beneficiaries_count?: number
  application_deadline?: string
  created_at?: Date
  updated_at?: Date
}

export type MongoDiseaseReport = {
  _id: ObjectId
  user_id: ObjectId
  crop_name: string
  disease_name: string
  confidence: number
  symptoms?: string[]
  treatment?: string[]
  prevention?: string[]
  image_url?: string
  reported_date: Date
  location?: string
  created_at?: Date
}

export type MongoWeatherData = {
  _id: ObjectId
  location: string
  date: Date
  temperature: number
  humidity: number
  precipitation: number
  wind_speed?: number
  condition: string
  created_at?: Date
}

export type MongoMarketPrice = {
  _id: ObjectId
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

export type MongoSoilAnalysis = {
  _id: ObjectId
  field_id: ObjectId
  user_id: ObjectId
  test_date: Date
  ph_level?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  organic_matter?: number
  recommendations?: string
  created_at?: Date
}

export type MongoCropsAPAlert = {
  _id: ObjectId
  crop: string
  pest_disease: string
  severity: string
  advisory: string
  reported_on: Date
  district?: string
  state?: string
}

export type MongoSchemeCategory = {
  _id: ObjectId
  name: string
  name_hi?: string
  name_mr?: string
}

export type MongoCropCategory = {
  _id: ObjectId
  name: string
  name_hi?: string
  name_mr?: string
}

export type MongoEncyclopedia = {
  _id: ObjectId
  title: string
  title_hi?: string
  title_mr?: string
  category: string
  content: string
  content_hi?: string
  content_mr?: string
  image_url?: string
  created_at?: Date
  updated_at?: Date
}
