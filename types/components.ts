import type { Db } from "mongodb"

export interface Field {
  _id: string
  name: string
  area: number
  coordinates?: Coordinates
  soil_type?: string
  irrigation_type?: string
  created_at?: Date
  updated_at?: Date
}

export interface Coordinates {
  latitude: number
  longitude: number
  altitude?: number
}

export interface Crop {
  _id: string
  crop_name: string
  crop_name_hi?: string
  crop_name_mr?: string
  scientific_name?: string
  family?: string
  description?: string
  photo_url?: string
}

export interface SoilAnalysis {
  _id: string
  field_id: string
  test_date: Date
  ph_level?: number
  nitrogen?: number
  nitrogen_level?: number
  phosphorus?: number
  phosphorus_level?: number
  potassium?: number
  potassium_level?: number
  organic_matter?: number
  recommendations?: string
}

export interface AIPrediction {
  className: string
  probability: number
}

export interface CropRecommendationParams {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  location: string
  season: string
  rainfall: number | null
  temperature: number | null
  db: Db
}

export interface RiskAssessment {
  overall_risk: string
  level: string
  score: number
  risk_factors: string[]
  factors: string[]
  recommendations?: string[]
}
