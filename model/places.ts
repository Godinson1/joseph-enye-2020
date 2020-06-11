export {}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
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
    geometry: {
        type: Object
    },
    userRating: {
        type: Number
    },
    photos: {
        type: Array
    },
    rating: {
        type: Number
    }}, {
        timestamps: true
    });

    const Places = mongoose.model('Places', placeSchema);

    module.exports = Places;