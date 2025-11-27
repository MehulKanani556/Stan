import mongoose from "mongoose";
import { ThrowError } from "../utils/ErrorUtils.js";
import fs from "fs";
import Game from "../models/Games.model.js";
import Subscribe from "../models/Subscribe.model.js";
import sendMail from "../helper/sendMail.js";
import { fileupload, deleteFile } from "../helper/cloudinary.js";
import CategoryModel from "../models/Category.model.js";

// Create a new game
export const createGame = function (req, res) {
  (async function () {
    const uploadedCloudFiles = [];

    const uploadedLocalFiles = [];
    try {
      const {
        title,
        description,
        category,
        size,
        instructions,
        tags,
        platforms, // platforms now contains price per platform
      } = req.body;

      // Handle cover image upload
      let coverImageData = null;
      if (req.files && req.files.cover_image) {
        const coverFilePath = req.files.cover_image[0].path;
        const coverFiledata = await fileupload(coverFilePath, "GameCoverImage");
        if (!coverFiledata.message) {
          coverImageData = {
            url: coverFiledata.Location,
            public_id: coverFiledata.public_id,
          };
          uploadedCloudFiles.push(coverImageData.public_id);
          if (fs.existsSync(coverFilePath)) {
            fs.unlinkSync(coverFilePath);
          }
        } else {
          // Remove all uploaded cloud files and local files before error out
          for (const public_id of uploadedCloudFiles) {
            try {
              await deleteFile(public_id);
            } catch { }
          }
          if (fs.existsSync(coverFilePath)) {
            fs.unlinkSync(coverFilePath);
          }
          return ThrowError(res, 400, "Cover image upload failed");
        }
      }

      // Handle video upload
      let videoData = null;
      if (req.files && req.files.video) {
        const videoFilePath = req.files.video[0].path;
        const videoFiledata = await fileupload(videoFilePath, "GameVideo");

        if (!videoFiledata.message) {
          videoData = {
            url: videoFiledata.Location,
            public_id: videoFiledata.public_id,
          };
          uploadedCloudFiles.push(videoData.public_id);
          if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
          }
        } else {
          for (const public_id of uploadedCloudFiles) {
            try {
              await deleteFile(public_id);
            } catch { }
          }
          if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
          }
          return ThrowError(res, 400, "Video upload failed");
        }
      }

      // Parse platforms data and handle platform file uploads
      let platformsData = {};
      if (platforms) {
        platformsData =
          typeof platforms === "string" ? JSON.parse(platforms) : platforms;
      }

      // For each platform, if a file is uploaded, upload it and set download_link (one-time, expiring)
      const platformNames = ["windows", "ios", "android"];
      for (const platform of platformNames) {
        if (
          req.files &&
          req.files[`${platform}_file`] // e.g. req.files.windows_file
        ) {
          const platformFileObj = req.files[`${platform}_file`][0];
          const platformFilePath = platformFileObj.path;
          const fileData = await fileupload(
            platformFilePath,
            `Game${platform.charAt(0).toUpperCase() + platform.slice(1)}File`
          );
          if (!fileData.message) {
            if (!platformsData[platform]) platformsData[platform] = {};
            platformsData[platform].download_link = fileData.url;
            platformsData[platform].public_id = fileData.public_id;
            // Set the size in MB (rounded to 2 decimals)
            if (typeof platformFileObj.size === "number") {
              // If file size is >= 1 GB, show in GB with 2 decimals, else in MB with 2 decimals
              if (platformFileObj.size >= 1024 * 1024 * 1024) {
                platformsData[platform].size =
                  (platformFileObj.size / (1024 * 1024 * 1024)).toFixed(2) +
                  " GB";
              } else {
                platformsData[platform].size =
                  (platformFileObj.size / (1024 * 1024)).toFixed(2) + " MB";
              }
            } else {
              // fallback: try to get file size from fs if not present
              try {
                const stats = fs.statSync(platformFilePath);
                platformsData[platform].size =
                  (stats.size / (1024 * 1024)).toFixed(2) + " MB";
              } catch (e) {
                platformsData[platform].size = "";
              }
            }
            uploadedCloudFiles.push(platformsData[platform].public_id);
            if (fs.existsSync(platformFilePath)) {
              fs.unlinkSync(platformFilePath);
            }
          } else {
            for (const public_id of uploadedCloudFiles) {
              try {
                await deleteFile(public_id);
              } catch { }
            }
            if (fs.existsSync(platformFilePath)) {
              fs.unlinkSync(platformFilePath);
            }
            return ThrowError(res, 400, `${platform} file upload failed`);
          }
        }
      }

      let imagesData = [];
      if (req.files && req.files.images) {
        for (const img of req.files.images) {
          const imgPath = img.path;
          const imgData = await fileupload(imgPath, "GameImages");
          if (!imgData.message) {
            const imgObj = {
              url: imgData.Location,
              public_id: imgData.public_id,
            };
            imagesData.push(imgObj);
            uploadedCloudFiles.push(imgObj.public_id);
            if (fs.existsSync(imgPath)) {
              fs.unlinkSync(imgPath);
            }
          } else {
            for (const public_id of uploadedCloudFiles) {
              try {
                await deleteFile(public_id);
              } catch { }
            }
            if (fs.existsSync(imgPath)) {
              fs.unlinkSync(imgPath);
            }
            return ThrowError(res, 400, "One of the images upload failed");
          }
        }
      }

      const game = new Game({
        title,
        description,
        cover_image: coverImageData,
        video: videoData,
        category,
        size,
        images: imagesData,
        instructions: instructions ? JSON.parse(instructions) : [],
        platforms: platformsData, // <-- platforms now includes price per platform
        tags: tags ? JSON.parse(tags) : [],
      });

      // console.log(game, platformsData);

      const savedGame = await game.save();
      if (!savedGame) {
        for (const public_id of uploadedCloudFiles) {
          try {
            await deleteFile(public_id);
          } catch { }
        }
        return ThrowError(res, 404, "Game not created");
      }

      const populatedGame = await Game.findById(savedGame._id).populate(
        "category"
      );

      // Send email to all subscribed users about the new game

      const subscribers = await Subscribe.find({ subscribe: true });
      const gameName = populatedGame.title;
      const coverImageUrl = populatedGame.cover_image?.url;
      const subject = `New Game Added: ${gameName}`;
      const body = `
        <h2>Exciting News!</h2>
        <p>We have added a new game: <b>${gameName}</b></p>
        ${coverImageUrl
          ? `<img src="${coverImageUrl}" alt="${gameName}" style="max-width:400px;" />`
          : ""
        }
        <p>Check it out on our platform now!</p>
      `;
      for (const sub of subscribers) {
        // sendMail(to, subject, text) - text can be HTML
        sendMail(sub.email, subject, body);
      }

      res.status(201).json(populatedGame);
    } catch (error) {
      // Clean up all uploaded cloud files if error occurs
      if (typeof uploadedCloudFiles !== "undefined") {
        for (const public_id of uploadedCloudFiles) {
          try {
            await deleteFile(public_id);
          } catch { }
        }
      }
      // Clean up all local files if error occurs
      if (req.files) {
        Object.values(req.files).forEach((fileArr) => {
          // fileArr can be an array (multer)
          if (Array.isArray(fileArr)) {
            fileArr.forEach((file) => {
              if (file.path && fs.existsSync(file.path)) {
                try {
                  fs.unlinkSync(file.path);
                } catch { }
              }
            });
          } else if (fileArr && fileArr.path && fs.existsSync(fileArr.path)) {
            try {
              fs.unlinkSync(fileArr.path);
            } catch { }
          }
        });
      }
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Update a game by ID
export const updateGame = function (req, res) {
  (async function () {
    // Helper to clean up all local files in req.files
    const cleanupLocalFiles = () => {
      if (req.files) {
        Object.values(req.files).forEach((fileArr) => {
          // fileArr can be an array (multer) or a single file object
          if (Array.isArray(fileArr)) {
            fileArr.forEach((file) => {
              if (file.path && fs.existsSync(file.path)) {
                try {
                  fs.unlinkSync(file.path);
                } catch { }
              }
            });
          } else if (fileArr && fileArr.path && fs.existsSync(fileArr.path)) {
            try {
              fs.unlinkSync(fileArr.path);
            } catch { }
          }
        });
      }
    };

    // Helper to clean up uploaded cloud files (public_ids)
    const cleanupCloudFiles = async (publicIds) => {
      if (Array.isArray(publicIds)) {
        for (const public_id of publicIds) {
          try {
            await deleteFile(public_id);
          } catch { }
        }
      }
    };

    // Track uploaded cloud files for cleanup on error
    let uploadedCloudFiles = [];

    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        cleanupLocalFiles();
        return ThrowError(res, 400, "Invalid game ID");
      }

      const game = await Game.findById(req.params.id);
      if (!game) {
        cleanupLocalFiles();
        return ThrowError(res, 404, "Game not found");
      }

      // Handle cover image update
      if (req.files && req.files.cover_image) {
        if (game.cover_image && game.cover_image.public_id) {
          try {
            await deleteFile(game.cover_image.public_id);
          } catch { }
        }

        const coverFiledata = await fileupload(
          req.files.cover_image[0].path,
          "GameCoverImage"
        );
        if (!coverFiledata.message) {
          game.cover_image = {
            url: coverFiledata.Location,
            public_id: coverFiledata.public_id,
          };
          uploadedCloudFiles.push(game.cover_image.public_id);
          if (fs.existsSync(req.files.cover_image[0].path)) {
            fs.unlinkSync(req.files.cover_image[0].path);
          }
        } else {
          cleanupLocalFiles();
          await cleanupCloudFiles(uploadedCloudFiles);
          return ThrowError(res, 400, "Cover image upload failed");
        }
      }

      // Handle video update
      if (req.files && req.files.video) {
        if (game.video && game.video.public_id) {
          try {
            await deleteFile(game.video.public_id);
          } catch { }
        }

        const videoFiledata = await fileupload(
          req.files.video[0].path,
          "GameVideo"
        );
        if (!videoFiledata.message) {
          game.video = {
            url: videoFiledata.Location,
            public_id: videoFiledata.public_id,
          };
          uploadedCloudFiles.push(game.video.public_id);
          if (fs.existsSync(req.files.video[0].path)) {
            fs.unlinkSync(req.files.video[0].path);
          }
        } else {
          cleanupLocalFiles();
          await cleanupCloudFiles(uploadedCloudFiles);
          return ThrowError(res, 400, "Video upload failed");
        }
      }

      // Update other fields
      game.title = req.body.title || game.title;
      game.description = req.body.description || game.description;
      game.category = req.body.category || game.category;
      game.size = req.body.size || game.size;
      game.isActive =
        req.body.isActive !== undefined ? req.body.isActive : game.isActive;

      // Update platforms and handle new platform file uploads
      let platformsData = {};
      if (req.body.platforms) {
        platformsData =
          typeof req.body.platforms === "string"
            ? JSON.parse(req.body.platforms)
            : req.body.platforms;
        game.platforms = { ...game.platforms, ...platformsData };
      }

      if (req.body.images && Array.isArray(req.body.images)) {
        const imagesToKeepUrls = req.body.images.map(String);
        const publicIdsToDelete = [];

        game.images.forEach((img) => {
          if (!imagesToKeepUrls.includes(img.url)) {
            if (img.public_id) {
              publicIdsToDelete.push(img.public_id);
            }
          }
        });

        for (const public_id of publicIdsToDelete) {
          try {
            await deleteFile(public_id);
          } catch (error) {
            console.error(
              `Failed to delete old image with public_id ${public_id}:`,
              error
            );
          }
        }
        game.images = game.images.filter((img) =>
          imagesToKeepUrls.includes(img.url)
        );
      } else {
        game.images = []
      }

      // Handle new images upload
      if (req.files && req.files.images) {
        for (const img of req.files.images) {
          const imgData = await fileupload(img.path, "GameImages");
          if (!imgData.message) {
            const imgObj = {
              url: imgData.Location,
              public_id: imgData.public_id,
            };
            game.images.push(imgObj);
            uploadedCloudFiles.push(imgObj.public_id);
            if (fs.existsSync(img.path)) {
              fs.unlinkSync(img.path);
            }
          } else {
            cleanupLocalFiles();
            await cleanupCloudFiles(uploadedCloudFiles);
            return ThrowError(res, 400, "One of the images upload failed");
          }
        }
      }

      // For each platform, if a file is uploaded, upload it and set download_link (one-time, expiring)
      const platformNames = ["windows", "ios", "android"];
      for (const platform of platformNames) {
        if (req.files && req.files[`${platform}_file`]) {
          const fileData = await fileupload(
            req.files[`${platform}_file`][0].path,
            `Game${platform.charAt(0).toUpperCase() + platform.slice(1)}File`
          );
          if (!fileData.message) {
            if (!game.platforms[platform]) game.platforms[platform] = {};
            game.platforms[platform].download_link = fileData.url;
            game.platforms[platform].public_id = fileData.public_id;
            uploadedCloudFiles.push(game.platforms[platform].public_id);
            if (fs.existsSync(req.files[`${platform}_file`][0].path)) {
              fs.unlinkSync(req.files[`${platform}_file`][0].path);
            }
          } else {
            cleanupLocalFiles();
            await cleanupCloudFiles(uploadedCloudFiles);
            return ThrowError(res, 400, `${platform} file upload failed`);
          }
        }
      }
      // console.log(game);

      if (req.body.tags) {
        try {
          game.tags = JSON.parse(req.body.tags);
        } catch {
          cleanupLocalFiles();
          await cleanupCloudFiles(uploadedCloudFiles);
          return ThrowError(res, 400, "Tags must be valid JSON");
        }
      }
      if (req.body.instructions) {
        try {
          game.instructions = JSON.parse(req.body.instructions);
        } catch {
          cleanupLocalFiles();
          await cleanupCloudFiles(uploadedCloudFiles);
          return ThrowError(res, 400, "Tags must be valid JSON");
        }
      }

      await game.save();
      const updatedGame = await Game.findById(game._id).populate("category");

      return res.status(200).json({
        message: "Game updated successfully",
        data: updatedGame,
      });
    } catch (error) {
      // Clean up all local files and uploaded cloud files if error occurs
      await (async () => {
        try {
          await cleanupCloudFiles(
            typeof uploadedCloudFiles !== "undefined" ? uploadedCloudFiles : []
          );
        } catch { }
        cleanupLocalFiles();
      })();
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get a single game by ID
export const getGameById = function (req, res) {
  (async function () {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ThrowError(res, 400, "Invalid game ID");
      }
      const game = await Game.findById(req.params.id).populate("category");
      if (!game) return ThrowError(res, 404, "Game not found");
      return res.status(200).json({
        message: "game by id fetched successfully",
        data: game,
        success: true,
      });
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get all games
export const getAllGames = function (req, res) {
  (async function () {
    try {
      const games = await Game.find()
        .populate("category")
        .select(
          "-platforms.windows.download_link -platforms.windows.public_id " +
          "-platforms.ios.download_link -platforms.ios.public_id " +
          "-platforms.android.download_link -platforms.android.public_id"
        );
      if (!games || games.length === 0)
        return ThrowError(res, 404, "No games found");
      res.json(games);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};
// Get the 10 newest games
export const getNew10Games = function (req, res) {
  (async function () {
    try {
      const games = await Game.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("category")
        .select(
          "-platforms.windows.download_link -platforms.windows.public_id " +
          "-platforms.ios.download_link -platforms.ios.public_id " +
          "-platforms.android.download_link -platforms.android.public_id"
        );
      if (!games || games.length === 0) {
        return ThrowError(res, 404, "No new games found");
      }
      res.status(200).json({
        message: "10 newest games fetched successfully",
        data: games,
        success: true,
      });
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get all games
export const getAllActiveGames = function (req, res) {
  (async function () {
    try {
      const games = await Game.find({ isActive: true }).populate("category");
      if (!games || games.length === 0)
        return ThrowError(res, 404, "No games found");
      res.json(games);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get all active games with pagination, category filter, and search
export const getAllActiveGamesWithPagination = function (req, res) {
  (async function () {
    try {
      // Parse query params
      let { page = 1, limit = 10, category, search } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      // Build query
      const query = { isActive: true };

      // Filter by category if provided
      if (category && category !== "all") {
        query.category = category;
      }

      // Search by title (case-insensitive)
      if (search && search.trim() !== "") {
        query.$or = [
          { title: { $regex: search.trim(), $options: "i" } },
          { tags: { $regex: search.trim(), $options: "i" } },
        ];
      }

      // Count total for pagination
      const total = await Game.countDocuments(query);

      // Fetch paginated games
      const games = await Game.find(query)
        .populate("category")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      if (!games || games.length === 0) {
        return ThrowError(res, 404, "No games found");
      }

      res.json({
        data: games,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        success: true,
      });
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get games by platform
export const getGamesByPlatform = function (req, res) {
  (async function () {
    try {
      const { platform } = req.params; // windows, ios, android

      if (!["windows", "ios", "android"].includes(platform)) {
        return ThrowError(
          res,
          400,
          "Invalid platform. Must be windows, ios, or android"
        );
      }

      const query = {};
      query[`platforms.${platform}.available`] = true;

      const games = await Game.find(query).populate("category");
      if (!games || games.length === 0) {
        return ThrowError(res, 404, `No games found for ${platform}`);
      }

      res.json(games);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Delete a game by ID and remove all files from the cloud
export const deleteGame = function (req, res) {
  (async function () {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ThrowError(res, 400, "Invalid game ID");
      }

      const game = await Game.findById(req.params.id);
      if (!game) return ThrowError(res, 404, "Game not found");

      // Helper to delete a file from cloudinary if public_id exists
      const deleteCloudFile = async (file) => {
        if (file && file.public_id) {
          await deleteFile(file.public_id);
        }
      };

      // Delete cover image
      if (game.cover_image && game.cover_image.public_id) {
        await deleteCloudFile(game.cover_image);
      }

      // Delete video
      if (game.video && game.video.public_id) {
        await deleteCloudFile(game.video);
      }

      // Delete all images (screenshots)
      if (Array.isArray(game.images)) {
        for (const image of game.images) {
          await deleteCloudFile(image);
        }
      }

      // Delete all platform files (windows, ios, android)
      if (game.platforms && typeof game.platforms === "object") {
        for (const platformKey of ["windows", "ios", "android"]) {
          const platform = game.platforms[platformKey];
          if (platform && platform.public_id) {
            await deleteCloudFile(platform);
          }
        }
      }

      const deletedGame = await Game.findByIdAndDelete(req.params.id);
      if (!deletedGame) return ThrowError(res, 404, "Game not found");

      res.status(200).json({
        success: true,
        message: "Game and all associated files deleted successfully",
      });
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

export const getLatestGamesByCategory = async function (req, res) {
  try {
    const latestGameIds = await Game.aggregate([
      { $sort: { category: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          gameId: { $first: "$_id" },
        },
      },
    ]);

    const gameIdToCategoryId = {};
    const gameIds = latestGameIds.map((item) => {
      gameIdToCategoryId[item.gameId.toString()] = item._id;
      return item.gameId;
    });

    const games = await Game.find({ _id: { $in: gameIds } })
      .populate({
        path: "category",
        model: "category",
      })
      .lean();

    const result = games.map((game) => {
      let category = game.category;
      if (Array.isArray(category)) category = category[0];

      return {
        _id: game._id,
        title: game.title,
        description: game.description,
        cover_image: game.cover_image || null,
        video: game.video || null,
        images: Array.isArray(game.images) ? game.images : [],
        category: category || null,
        instructions: Array.isArray(game.instructions) ? game.instructions : [],
        platforms: game.platforms || {},
        isActive: game.isActive,
        tags: Array.isArray(game.tags) ? game.tags : [],
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        __v: game.__v,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return ThrowError(res, 500, error.message);
  }
};

export const getGamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    }

    // Check if category exists
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // Find games belonging to this category
    const games = await Game.find({ category })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    if (!games || games.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No games found in this category." });
    }

    return res.status(200).json({
      success: true,
      category: categoryExists.name,
      totalGames: games.length,
      games,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
