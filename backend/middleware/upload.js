import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

// Ensure env vars are loaded if this file is imported before server.js config runs
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_FOLDER || 'primeauto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize on upload
    }
});

// Check File Type (handled by allowed_formats in storage, but keeping logic if needed for other validation)
// With CloudinaryStorage, fileFilter is still useful for other checks if needed, but format check is built-in.
// We can simplify or keep the custom filter. Cloudinary storage throws error for invalid format? 
// Actually, CloudinaryStorage returns error if format not allowed.
// But let's keep the size limit in multer options.

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Images Only!'));
    }
});

export default upload;

