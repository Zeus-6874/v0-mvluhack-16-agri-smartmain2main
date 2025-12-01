import type { ObjectId } from "mongodb"

export interface UserFilter {
  _id?: ObjectId | string
  email?: string | RegExp
  is_admin?: boolean
}

export interface FarmerFilter {
  _id?: ObjectId | string
  user_id?: string
  state?: string | RegExp
  district?: string | RegExp
}

export interface FieldFilter {
  _id?: ObjectId | string
  farmer_id?: string
  soil_type?: string | RegExp
}

export interface CropCycleFilter {
  _id?: ObjectId | string
  farmer_id?: string
  field_id?: string | { $in: string[] }
  status?: string | { $in: string[] }
  planting_date?: { $gte?: Date; $lte?: Date }
}

export interface SchemeFilter {
  _id?: ObjectId | string
  state?: string | RegExp
  category?: string | RegExp
  is_active?: boolean
}

export interface MarketPriceFilter {
  crop?: string | RegExp
  commodity?: string | RegExp
  state?: string | RegExp
  date?: { $gte?: Date; $lte?: Date }
}

export interface FieldActivityFilter {
  _id?: ObjectId | string
  crop_cycle_id?: string
  activity_type?: string | RegExp
  activity_date?: { $gte?: Date; $lte?: Date }
}
