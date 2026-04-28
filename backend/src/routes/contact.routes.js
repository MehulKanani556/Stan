import express from "express";
import { getAllContactMessages, submitContactForm } from "../controllers/contactController.js";
import { isAdmin, UserAuth } from "../middlewares/auth.js";

const contactRoutes = express.Router();

contactRoutes.post("/submit", submitContactForm);
contactRoutes.get("/messages", UserAuth, isAdmin, getAllContactMessages);

export default contactRoutes;
