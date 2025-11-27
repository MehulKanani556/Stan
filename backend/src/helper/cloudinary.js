import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { S3, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import sharp from "sharp";

// If you previously relied on cloudinary.config uncomment and adapt:
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_INARYSECRET,
// });

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const isImageExt = (ext) =>
  [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);

const contentTypeMap = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".vtt": "text/vtt",
};

// Helper function to determine content type, now supporting Windows, iOS, Android application files, as well as .zip and .rar
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    // Images
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    // Videos
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".mkv": "video/x-matroska",
    ".m3u8": "application/vnd.apple.mpegurl",
    ".ts": "video/mp2t",
    ".vtt": "text/vtt",
    // Windows application
    ".exe": "application/vnd.microsoft.portable-executable",
    ".msi": "application/x-msdownload",
    // iOS application
    ".ipa": "application/octet-stream",
    // Android application
    ".apk": "application/vnd.android.package-archive",
    // Archives
    ".zip": "application/zip",
    ".rar": "application/vnd.rar",
    ".7z": "application/x-7z-compressed",
  };
  return map[ext] || "application/octet-stream";
};

export const fileupload = async (filePath, folderName) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const base = path.basename(filePath, ext);

    let uploadBody;
    let contentType;
    let key;

    if (isImageExt(ext)) {
      // Read file into buffer to avoid Windows locking issues
      const inputBuffer = fs.readFileSync(filePath);
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();

      const isPngLike =
        ext === ".png" ||
        (metadata.hasAlpha && (ext === ".gif" || ext === ".webp"));

      const webpOptions = isPngLike
        ? { quality: 80, alphaQuality: 90, effort: 6 }
        : { quality: 75, alphaQuality: 90, effort: 6 };

      uploadBody = await image.webp(webpOptions).toBuffer();
      contentType = "image/webp";
      key = `${folderName}/${base}.webp`;
    } else {
      // Non-image: upload as-is
      uploadBody = fs.readFileSync(filePath);
      contentType = getContentType(filePath);
      key = `${folderName}/${path.basename(filePath)}`;
    }

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: uploadBody,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable",
    };

    console.log("Bucket name being used for upload:", uploadParams.Bucket);

    // Using v3 client: putObject resolves as a promise
    await s3.putObject(uploadParams);

    return {
      Location: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
      ETag: uploadParams.Key,
      url: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
      public_id: uploadParams.Key,
    };
  } catch (error) {
    throw error;
  }
};

export const uploadHLSFolder = async (folderPath, s3Folder) => {
  const files = fsExtra.readdirSync(folderPath);
  const uploadResults = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    const ext = path.extname(file).toLowerCase();
    const contentType = contentTypeMap[ext] || "application/octet-stream";

    if (
      !file.endsWith(".m3u8") &&
      !file.endsWith(".ts") &&
      !file.endsWith(".vtt")
    )
      continue;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME,
      Key: `${s3Folder}/${file}`,
      Body: fs.createReadStream(filePath),
      ACL: "public-read",
      ContentType: contentType,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const res = await upload.done();
    uploadResults.push({
      name: file,
      url: res.Location,
      key: res.Key,
    });

    fs.unlinkSync(filePath);
  }

  const master = uploadResults.find((f) => f.name.includes("master.m3u8"));
  return {
    masterUrl: master ? master.url : null,
    files: uploadResults,
    key: master?.key,
  };
};

export const deleteFile = async (public_id) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME,
      Key: public_id,
    };

    if (typeof s3.send === "function") {
      const result = await s3.send(new DeleteObjectCommand(deleteParams));
      return result;
    } else if (typeof s3.deleteObject === "function") {
      const result = await s3.deleteObject(deleteParams).promise();
      return result;
    } else {
      throw new Error("Unsupported S3 client: cannot delete object");
    }
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};
