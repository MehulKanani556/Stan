import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
dotenv.config();

// Configure S3 storage
const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY?.trim(),
      secretAccessKey: process.env.S3_SECRET_KEY?.trim(),   
    },
    region: process.env.S3_REGION || "us-east-1",
  });

  console.log(process.env.S3_ACCESS_KEY?.trim(), process.env.S3_SECRET_KEY?.trim());

const platformFolders = {
    windows_file: 'games/windows',
    ios_file: 'games/ios',
    android_file: 'games/android',
    ps5_file: 'games/ps5',
    xbox_file: 'games/xbox',
    vision_pro_file: 'games/vision-pro',
    quest_file: 'games/quest',
    nintendo_switch_1_file: 'games/nintendo-switch-1',
    nintendo_switch_2_file: 'games/nintendo-switch-2',
};

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
        } else if (file.fieldname === 'cover_image' || file.fieldname === 'images') {
            folder = 'games/images';
        } else if (file.fieldname === 'trailer') {
            folder = 'trailer';
        } else if (platformFolders[file.fieldname]) {
            folder = platformFolders[file.fieldname];
        }
        
        const finalName = `${folder}/${timestamp}-${sanitizedName}`;
        cb(null, finalName);
    }
});

const imageFields = new Set([
    'profilePic',
    'thumbnail',
    'image',
    'starring_image',
    'category_image',
    'bg_image',
    'messageImage',
    'cover_image',
    'images',
]);

const videoFields = new Set(['video', 'trailer']);

const platformExecutableFields = new Set([
    'windows_file',
    'ios_file',
    'android_file',
    'ps5_file',
    'xbox_file',
    'vision_pro_file',
    'quest_file',
    'nintendo_switch_1_file',
    'nintendo_switch_2_file',
]);

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

    // Executable file types for game files
const allowedExecutableExts = [
    '.exe',
    '.msi',
    '.apk',
    '.obb',
    '.ipa',
    '.dmg',
    '.pkg',
    '.app',
    '.appx',
    '.deb',
    '.rpm',
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
    '.tgz',
    '.bz2',
    '.unitypackage',
    '.bin',
];
const allowedExecutableMimeTypes = [
        'application/vnd.android.package-archive',
        'application/octet-stream',
        'application/x-octet-stream',
        'application/x-msdownload',
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-tar',
        'application/gzip',
    ];

    if (imageFields.has(file.fieldname)) {
        if (!allowedImageExts.includes(ext) || !allowedImageMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid image format. Allowed formats: ${allowedImageExts.join(', ')}`));
        }
    } else if (videoFields.has(file.fieldname)) {
        if (!allowedVideoExts.includes(ext) || !allowedVideoMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid video format. Allowed formats: ${allowedVideoExts.join(', ')}`));
        }
    } else if (platformExecutableFields.has(file.fieldname)) {
        if (!allowedExecutableExts.includes(ext) || !allowedExecutableMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid executable format. Allowed formats: ${allowedExecutableExts.join(', ')}`));
        }
    } else {
        return cb(new Error(`Invalid field name: ${file.fieldname}. Expected one of: ${[
            ...imageFields,
            ...videoFields,
            ...platformExecutableFields,
        ].join(', ')}`));
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
        if (file.fieldname === 'profilePic' || file.fieldname === 'thumbnail' || file.fieldname === 'messageImage') {
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