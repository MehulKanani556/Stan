import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from "multer-s3";
import dotenv from 'dotenv';

dotenv.config();

// Configure S3 storage
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY.trim(),
        secretAccessKey: process.env.S3_SECRET_KEY.trim()
    },
    region: process.env.S3_REGION || "us-east-1"
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
        const sanitizedName = file.originalname.replace(/\s+/g, '');
        const timestamp = Date.now();
        
        // Organize files by field type in S3
        let folder = 'uploads';
        if (file.fieldname === 'profilePic') {
            folder = 'profilePic';
        } else if (file.fieldname === 'thumbnail' || file.fieldname === 'image') {
            folder = 'images';
        } else if (file.fieldname === 'video') {
            folder = 'videos';
        }
        
        const finalName = `${folder}/${timestamp}-${sanitizedName}`;
        cb(null, finalName);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Image file types
    const allowedImageExts = ['.jpeg', '.jpg', '.png', '.webp', '.jfif'];
    const allowedImageMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/jfif',
        'application/octet-stream'
    ];

    // Video file types
    const allowedVideoExts = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
    const allowedVideoMimeTypes = [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv',
        'video/x-flv',
        'video/x-matroska'
    ];

    // Check if it's an image or video file
    if (
        file.fieldname === 'profilePic' ||
        file.fieldname === 'thumbnail' ||
        file.fieldname === 'image' ||
        file.fieldname === 'starring_image' ||
        file.fieldname === 'category_image' ||
        file.fieldname === 'bg_image'
    ) {
        if (!allowedImageExts.includes(ext) || !allowedImageMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid image format. Allowed formats: ${allowedImageExts.join(', ')}`));
        }
    } else if (file.fieldname === 'video') {
        if (!allowedVideoExts.includes(ext) || !allowedVideoMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid video format. Allowed formats: ${allowedVideoExts.join(', ')}`));
        }
    } else {
        return cb(new Error(`Invalid field name: ${file.fieldname}. Expected 'profilePic', 'thumbnail', 'image', 'starring_image', 'category_image', 'bg_image', or 'video'`));
    }

    cb(null, true);
};

// Create base multer instance
const multerInstance = multer({
    storage: storage,
    fileFilter
});

// Create different upload handlers
const upload = {
    // For single file upload (e.g., profile image)
    single: (fieldName) => {
        return multerInstance.single(fieldName);
    },
    
    // For multiple files with specific fields (e.g., thumbnail and video)
    fields: (fields) => {
        return multerInstance.fields(fields);
    },
    
    // For multiple files with the same field name
    array: (fieldName, maxCount) => {
        return multerInstance.array(fieldName, maxCount);
    }
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: false,
            msg: err.message,
            data: null
        });
    }
    if (err) {
        return res.status(400).json({
            status: false,
            msg: err.message,
            data: null
        });
    }
    next();
};

const convertJfifToWebp = async (req, res, next) => {
    try {
        const file = req.file || (req.files && req.files['image'] && req.files['image'][0]);
        if (!file) return next();

        // Only process image files
        if (file.fieldname === 'profilePic' || file.fieldname === 'thumbnail' || file.fieldname === 'image') {
            const ext = path.extname(file.originalname).toLowerCase();

            if (ext === '.jfif' || file.mimetype === 'image/jfif' || file.mimetype === 'application/octet-stream') {
                // For S3, we'll need to download, convert, and re-upload
                // This is a placeholder - you might want to handle JFIF conversion on the client side
                // or implement a more complex S3 download -> convert -> upload flow
                console.log(`JFIF file detected: ${file.originalname}. Consider converting to WebP on client side for better S3 integration.`);
            }
        }

        next();
    } catch (err) {
        console.error('Error in convertJfifToWebp:', err);
        next(err);
    }
};

export { upload, handleMulterError, convertJfifToWebp };
export default upload;