import { Request, Response } from "express";
import { cloneTemplateService } from "../services/templateService";

export const cloneTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { templateId, newName, userId } = req.body;

  if (!templateId || !newName || !userId) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const newListId = await cloneTemplateService(templateId, newName, userId);
    res.status(200).json({ success: true, newListId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
