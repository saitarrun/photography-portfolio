"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PhotoInsert, PhotoUpdate, Photo } from "@/types/database";

export async function createPhoto(data: PhotoInsert) {
  const supabase = await createClient();
  const { data: photo, error } = await supabase
    .from("photos")
    .insert(data as never)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/locations");
  return photo as unknown as Photo;
}

export async function updatePhoto(id: string, data: PhotoUpdate) {
  const supabase = await createClient();
  const { data: photo, error } = await supabase
    .from("photos")
    .update(data as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/locations");
  return photo as unknown as Photo;
}

export async function deletePhoto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/locations");
}

export async function reorderPhotos(
  orderedIds: { id: string; display_order: number }[]
) {
  const supabase = await createClient();

  for (const item of orderedIds) {
    const { error } = await supabase
      .from("photos")
      .update({ display_order: item.display_order } as never)
      .eq("id", item.id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/locations");
}
