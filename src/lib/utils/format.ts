export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatExif(metadata: {
  camera?: string | null;
  lens?: string | null;
  aperture?: string | null;
  iso?: number | null;
  shutter_speed?: string | null;
  focal_length?: string | null;
}): string[] {
  const parts: string[] = [];
  if (metadata.camera) parts.push(metadata.camera);
  if (metadata.lens) parts.push(metadata.lens);
  if (metadata.focal_length) parts.push(metadata.focal_length);
  if (metadata.aperture) parts.push(`ƒ/${metadata.aperture}`);
  if (metadata.shutter_speed) parts.push(`${metadata.shutter_speed}s`);
  if (metadata.iso) parts.push(`ISO ${metadata.iso}`);
  return parts;
}
