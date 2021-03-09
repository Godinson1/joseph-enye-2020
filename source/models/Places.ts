import { IPlaces } from "./interface";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//Define mongoose schema for place
const PlaceSchema = new Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    vicinity: {
      type: String,
    },
    placeId: {
      type: String,
      unique: true,
    },
    icon: {
      type: String,
    },
    lat: {
      type: String,
    },
    lng: {
      type: String,
    },
    userRating: {
      type: Number,
    },
    rating: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Places = mongoose.model<IPlaces>("Places", PlaceSchema);

export { Places };
