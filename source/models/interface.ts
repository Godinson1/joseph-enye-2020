import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  userID: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IPlaces extends mongoose.Document {
  userID: mongoose.Types.ObjectId;
  name: string;
  vicinity: string;
  placeId: string;
  icon: string;
  lat: string;
  lng: string;
  userRating: number;
  rating: string;
}
