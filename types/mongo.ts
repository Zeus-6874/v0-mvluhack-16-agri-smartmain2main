import { ObjectId } from "mongodb"

export type MongoUser = {
  _id: ObjectId
  email: string
  password: string
}
