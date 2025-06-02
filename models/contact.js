const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    project: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
