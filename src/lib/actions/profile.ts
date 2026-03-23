"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PhotographerProfileUpdate, PhotographerProfile } from "@/types/database";

export async function updateProfile(id: string, data: PhotographerProfileUpdate) {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("photographer_profile")
    .update(data as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return profile as unknown as PhotographerProfile;
}
