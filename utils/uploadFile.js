const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage config to save files locally before upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Function to upload file to Cloudinary and delete local copy
const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'real_estate'
        });

        // Delete local file after successful upload
        fs.unlinkSync(filePath);

        return result.secure_url;
    } catch (error) {
        throw new Error('Cloudinary Upload Failed: ' + error.message);
    }
};

module.exports = { uploadFile, storage };
