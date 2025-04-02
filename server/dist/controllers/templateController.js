"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneTemplate = void 0;
const templateService_1 = require("../services/templateService");
const cloneTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { templateId, newName, userId } = req.body;
    if (!templateId || !newName || !userId) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }
    try {
        const newListId = yield (0, templateService_1.cloneTemplateService)(templateId, newName, userId);
        res.status(200).json({ success: true, newListId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.cloneTemplate = cloneTemplate;
