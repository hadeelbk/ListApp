import express from "express";
import { cloneTemplate } from "../controllers/templateController";

const router = express.Router();

router.post("/clone", cloneTemplate);

export default router;
