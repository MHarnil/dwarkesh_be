const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    address: String,
    contactNumber: String,
    propertyDetail: {
        bhk: Number,
        sqft: Number,
        stutestype: String
    },
    floorPlan: [{
        title: String,
        images: [String]
    }],
    projectGallery: [String]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
