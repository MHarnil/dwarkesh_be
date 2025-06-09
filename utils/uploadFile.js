import dotenv from 'dotenv';
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadFile = async (fileBuffer) => {
    try {
        const fileSize = fileBuffer.length;
        const maxFileSize = 10 * 1024 * 1024;
        if (fileSize > maxFileSize) {
            throw new Error("File size exceeds the maximum allowed limit.");
        }
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                folder: "real_estate",
            };
            cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(result.secure_url);
                }
            }).end(fileBuffer);
        });
    } catch (error) {
        throw new Error("Error uploading file..",error.message);
    }
};
export {uploadFile};