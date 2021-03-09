export {}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define mongoose schema for place
const placeSchema = new Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    vicinity: {
        type: String
    },
    placeId: {
        type: String,
        unique: true
    },
    icon: {
        type: String
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    userRating: {
        type: Number
    },
    rating: {
        type: String
    }}, {
        timestamps: true
    });

    //configure model
    const PlaceModel = mongoose.model('PlaceModel', placeSchema);

    //export place model
    module.exports = PlaceModel;