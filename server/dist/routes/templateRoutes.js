"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const templateController_1 = require("../controllers/templateController");
const router = express_1.default.Router();
// POST /api/templates/clone
router.post("/clone", templateController_1.cloneTemplate);
exports.default = router;
