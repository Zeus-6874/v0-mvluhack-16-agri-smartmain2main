export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  total: number
  page: number
  per_page: number
}

export interface DiseaseDetectionResult {
  disease_name: string
  confidence: number
  symptoms: string[]
  treatments: string[]
  prevention_tips?: string[]
  crop_name: string
  severity: string
  analysis_method?: string
  ai_confidence?: string
  processing_time?: string
}

export interface CropRecommendation {
  name: string
  suitability_score: number
}

export interface FertilizerRecommendation {
  nutrient: string
  fertilizer: string
  quantity: string
  priority: string
}

export interface MarketInsight {
  crop_name: string
  mandi: string
  district: string
  state: string
  arrival_date: string
  current_price: number | string
  market_status: string
  price_trend?: string
  market_demand?: string
  profit_potential?: string
  investment_required?: number
}
