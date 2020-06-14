export {}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    const PlaceModel = mongoose.model('PlaceModel', placeSchema);

    module.exports = PlaceModel;