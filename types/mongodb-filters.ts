import type { ObjectId } from "mongodb"

// Helper type for ID queries - MongoDB accepts both string and ObjectId
export type IdQuery = ObjectId | { $in: ObjectId[] } | { $eq: ObjectId }

// Helper type for string queries with regex support
export type StringQuery = string | RegExp | { $in: string[] } | { $regex: string }

// Helper type for date range queries
export type DateRangeQuery = {
  $gte?: Date
  $lte?: Date
  $gt?: Date
  $lt?: Date
}

// Helper type for boolean queries
export type BooleanQuery = boolean | { $eq: boolean }

// Utility function to convert string ID to ObjectId for queries
export function toObjectIdFilter(id: string | ObjectId): ObjectId {
  if (typeof id === "string") {
    return new ObjectId(id)
  }
  return id
}

export interface UserFilter {
  _id?: IdQuery
  email?: StringQuery
  is_admin?: BooleanQuery
}

export interface FarmerFilter {
  _id?: IdQuery
  user_id?: IdQuery
  state?: StringQuery
  district?: StringQuery
}

export interface FieldFilter {
  _id?: IdQuery
  farmer_id?: IdQuery
  soil_type?: StringQuery
}

export interface CropCycleFilter {
  _id?: IdQuery
  farmer_id?: IdQuery
  field_id?: IdQuery
  status?: StringQuery
  planting_date?: DateRangeQuery
}

export interface SchemeFilter {
  _id?: IdQuery
  state?: StringQuery
  category?: StringQuery
  is_active?: BooleanQuery
}

export interface MarketPriceFilter {
  crop?: StringQuery
  commodity?: StringQuery
  state?: StringQuery
  date?: DateRangeQuery
}

export interface FieldActivityFilter {
  _id?: IdQuery
  crop_cycle_id?: IdQuery
  activity_type?: StringQuery
  activity_date?: DateRangeQuery
}
