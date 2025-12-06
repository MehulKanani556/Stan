import mongoose from "mongoose";
import { ThrowError } from '../utils/ErrorUtils.js';
import fs from "fs";
import Category from "../models/Category.model.js";

import { fileupload,deleteFile } from "../helper/cloudinary.js";


export const createCategory = function (req, res) {
    (async function () {
        try {
            const categoryName = req.body.categoryName;
            const category_description = req.body.category_description;
            
            // Check if file is uploaded
            if (!req.file) {
                return ThrowError(res, 400, 'Category image is required');
            }

            // When using multer-s3, req.file.location contains the S3 URL
            // and req.file.key contains the S3 key
            const category = new Category({
                categoryName: categoryName,
                category_image: {
                    url: req.file.location || req.file.path, // S3 URL or local path
                    public_id: req.file.key || req.file.filename // S3 key or filename
                },
                category_description: category_description
            });

            const savedCategory = await category.save();
            if (!savedCategory) return ThrowError(res, 404, 'Category not created');
            res.status(201).json(savedCategory);

        } catch (error) {
            console.error('Error creating category:', error);
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Get a single category by ID
export const getCategoryById = function (req, res) {
    (async function () {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return ThrowError(res, 400, 'Invalid category ID');
            }
            const category = await Category.findById(req.params.id);
            if (!category) return ThrowError(res, 404, 'Category not found');
            res.json(category);
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Get all categories
export const getAllCategories = function (req, res) {
    (async function () {
        try {
            const categories = await Category.find();
            if (!categories || categories.length === 0) return ThrowError(res, 404, 'No categories found');
            res.json(categories);
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Update a category by ID
export const updateCategory = function (req, res) {
    (async function () {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return ThrowError(res, 400, 'Invalid category ID');
            }

            const category = await Category.findById(req.params.id);
            if (!category) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return ThrowError(res, 404, 'Category not found');
            }

            // If a new image is uploaded, delete the old one
            if (req.file) {
                // Delete old image from S3 if it exists
                if (category.category_image && category.category_image.public_id) {
                    try {
                        await deleteFile(category.category_image.public_id);
                    } catch (deleteError) {
                        console.error('Error deleting old file from S3:', deleteError);
                        // Continue with update even if old file deletion fails
                    }
                }

                // Initialize category_image object if it doesn't exist
                if (!category.category_image) {
                    category.category_image = {};
                }
                
                // When using multer-s3, req.file.location contains the S3 URL
                // and req.file.key contains the S3 key
                category.category_image.url = req.file.location || req.file.path;
                category.category_image.public_id = req.file.key || req.file.filename;
            }

            // Update other fields
            category.categoryName = req.body.categoryName || category.categoryName;
            category.category_description = req.body.category_description || category.category_description;

            await category.save();

            return res.status(200).json({
                message: "Category updated successfully",
                data: category
            });

        } catch (error) {
            if (req.file?.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return ThrowError(res, 500, error.message);
        }
    })();
};

// Delete a category by ID
export const deleteCategory = function (req, res) {
    (async function () {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return ThrowError(res, 400, 'Invalid category ID');
            }
            const category = await Category.findById(req.params.id);
            
            if (!category) {
                return ThrowError(res, 404, 'Category not found');
            }

            // Delete image from cloudinary if it exists
            if (category.category_image && category.category_image.public_id) {
                try {
                    await deleteFile(category.category_image.public_id);
                } catch (deleteError) {
                    console.error('Error deleting file from cloudinary:', deleteError);
                    // Continue with category deletion even if file deletion fails
                }
            }

            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (!deletedCategory) return ThrowError(res, 404, 'Category not found');
            res.status(200).json({ success: true, message: 'Category deleted' });
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
}; 