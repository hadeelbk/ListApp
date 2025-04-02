import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const cloneTemplateService = async (
  templateId: string,
  newName: string,
  userId: string
): Promise<string> => {

  // Get template items
  const { data: templateItems, error: fetchError } = await supabase
    .from("list_items")
    .select("content")
    .eq("list_id", templateId);

  if (fetchError) throw fetchError;

  // Create new list
  const { data: newListData, error: insertError } = await supabase
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

  if (insertError || !newListData) throw insertError;

  const newListId = newListData.id;

  // Insert copied items
  const itemsToInsert = (templateItems || []).map((item) => ({
    list_id: newListId,
    content: item.content,
    is_checked: false,
  }));

  if (itemsToInsert.length > 0) {
    const { error: insertItemsError } = await supabase
      .from("list_items")
      .insert(itemsToInsert);

    if (insertItemsError) throw insertItemsError;
  }

  return newListId;
};
