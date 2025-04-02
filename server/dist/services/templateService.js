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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneTemplateService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const cloneTemplateService = (templateId, newName, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get template items
    const { data: templateItems, error: fetchError } = yield supabase
        .from("list_items")
        .select("content")
        .eq("list_id", templateId);
    if (fetchError)
        throw fetchError;
    // 2. Create new list
    const { data: newListData, error: insertError } = yield supabase
        .from("lists")
        .insert([
        {
            name: newName,
            user_id: userId,
            visibility: "private",
            is_template: false,
        },
    ])
        .select()
        .single();
    if (insertError || !newListData)
        throw insertError;
    const newListId = newListData.id;
    // 3. Insert copied items
    const itemsToInsert = (templateItems || []).map((item) => ({
        list_id: newListId,
        content: item.content,
        is_checked: false,
    }));
    if (itemsToInsert.length > 0) {
        const { error: insertItemsError } = yield supabase
            .from("list_items")
            .insert(itemsToInsert);
        if (insertItemsError)
            throw insertItemsError;
    }
    return newListId;
});
exports.cloneTemplateService = cloneTemplateService;
