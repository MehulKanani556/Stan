import HometrailerModal from "../models/HomeTrailersModel.js";
import { sendUnauthorizedResponse } from "../utils/ResponseUtils.js";

export const createTrailer = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const trailer = req.file ? req.file.location : req.body.trailer;
    const homeTrailer = await HometrailerModal.create({
      title,
      description,
      link,
      trailer,
    });

    res.status(200).json({
      success: true,
      msg: "Home trailer added successfully",
      homeTrailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getAllTrailer = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorizedResponse(res, "Authentication required");
    }
    const homeTrailer = await HometrailerModal.find();
    res.status(200).json({
      success: true,
      msg: "Home trailer get successfully",
      homeTrailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Public function to get all trailers without authentication
export const getPublicTrailers = async (req, res) => {
  try {
    const homeTrailer = await HometrailerModal.find();
    res.status(200).json({
      success: true,
      msg: "Home trailer get successfully",
      homeTrailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateTrailer = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorizedResponse(res, "Authentication required");
    }

    const { id } = req.params;
    const { title, description, link } = req.body;
    const trailer = req.file ? req.file.location : req.body.trailer;

    const updatedTrailer = await HometrailerModal.findByIdAndUpdate(
      id,
      { title, description, link, trailer },
      { new: true } // returns updated document
    );

    if (!updatedTrailer) {
      return res.status(404).json({
        success: false,
        msg: "Trailer not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Trailer updated successfully",
      updatedTrailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const deleteTrailer = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorizedResponse(res, "Authentication required");
    }

    const { id } = req.params;

    const deletedTrailer = await HometrailerModal.findByIdAndDelete(id);

    if (!deletedTrailer) {
      return res.status(404).json({
        success: false,
        msg: "Trailer not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Trailer deleted successfully",
      deletedTrailer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
