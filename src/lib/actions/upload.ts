"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(filePath);

  return publicUrl;
}
