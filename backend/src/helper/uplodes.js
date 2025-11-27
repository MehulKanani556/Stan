import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = file.fieldname;
    const uploadPath = path.join("uploads", folderName);

    fs.mkdir(uploadPath, { recursive: true }, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replaceAll(" ", "")}`);
  },
});


const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  limits: {
    fileSize: 600 * 1024 * 1024, // 600MB limit
  },
});

const convertJfifToJpeg = async (req, res, next) => {
  try {
    const file =
      req.file || (req.files && req.files["image"] && req.files["image"][0]);
    if (!file) return next();

    // Only process image files
    if (file.fieldname === "thumbnail" || file.fieldname === "image") {
      const ext = path.extname(file.originalname).toLowerCase();

      if (
        ext === ".jfif" ||
        file.mimetype === "image/jfif" ||
        file.mimetype === "application/octet-stream"
      ) {
        console.warn(
          "JFIF to JPEG conversion is currently designed for local files and might not work as expected with direct S3 uploads. Consider client-side conversion or a different server-side approach."
        );
      }
    }

    next();
  } catch (err) {
    console.error("Error in convertJfifToJpeg:", err);
    next(err);
  }
};

export { upload, convertJfifToJpeg };
