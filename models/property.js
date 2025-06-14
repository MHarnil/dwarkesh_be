const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    propertyType: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType' },
    address: String,
    contactNumber: String,
    propertyDetail: {
        bhk: Number,
        sqft: Number,
        stutestype: String
    },
    floorPlan: [{
        title: String,
        image: [String]
    }],
    projectGallery: [String]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
