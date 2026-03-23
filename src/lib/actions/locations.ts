"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LocationInsert, LocationUpdate, Location } from "@/types/database";

export async function createLocation(data: LocationInsert) {
  const supabase = await createClient();
  const { data: location, error } = await supabase
    .from("locations")
    .insert(data as never)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/locations");
  return location as unknown as Location;
}

export async function updateLocation(id: string, data: LocationUpdate) {
  const supabase = await createClient();
  const { data: location, error } = await supabase
    .from("locations")
    .update(data as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const loc = location as unknown as Location;
  revalidatePath("/");
  revalidatePath("/locations");
  revalidatePath(`/locations/${loc.slug}`);
  return loc;
}

export async function deleteLocation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/locations");
}

export async function reorderLocations(
  orderedIds: { id: string; display_order: number }[]
) {
  const supabase = await createClient();

  for (const item of orderedIds) {
    const { error } = await supabase
      .from("locations")
      .update({ display_order: item.display_order } as never)
      .eq("id", item.id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/locations");
}
