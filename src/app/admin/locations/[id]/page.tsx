"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { Location } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditLocationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("locations")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setLocation(data as unknown as Location);
    }
    load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!location) return;
    setSaving(true);

    const supabase = createClient();
    let coverImageUrl = location.cover_image_url;

    try {
      // 1. Upload new cover image if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cover-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
        
        coverImageUrl = publicUrl;
      }

      // 2. Update database
      const { error } = await supabase
        .from("locations")
        .update({
          name: location.name,
          slug: location.slug,
          short_description: location.short_description,
          long_description: location.long_description,
          cover_image_url: coverImageUrl,
          featured: location.featured,
        } as never)
        .eq("id", id);

      if (error) throw error;
      router.push("/admin/locations");
    } catch (err: any) {
      alert(err.message || "Error saving location");
    } finally {
      setSaving(true); // Keep disabled until redirect
    }
  }

  if (!location) {
    return (
      <p className="font-body text-sm text-on-surface-variant">Loading...</p>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface mb-8">
        Edit: {location.name}
      </h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Input
            label="Name"
            value={location.name}
            onChange={(e) =>
              setLocation({ ...location, name: e.target.value })
            }
            required
          />
          <Input
            label="Slug"
            value={location.slug}
            onChange={(e) =>
              setLocation({ ...location, slug: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-4">
          <label className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
            Location Cover Image
          </label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed p-10 text-center transition-colors cursor-pointer rounded-2xl ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50 bg-white/[0.02]'
            }`}
          >
            <input {...getInputProps()} />
            {(preview || location.cover_image_url) ? (
              <div className="relative aspect-[16/6] md:aspect-[21/7] max-w-2xl mx-auto overflow-hidden rounded-xl">
                <Image 
                  src={preview || location.cover_image_url || ""} 
                  alt="Cover Preview" 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-body">Click or drag to replace cover image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <p className="font-body text-sm text-on-surface">
                  {isDragActive ? "Drop the cover image here" : "Drag and drop location cover, or click to select"}
                </p>
                <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                  High-res cinematic shot (Max 100MB)
                </p>
              </div>
            )}
          </div>
        </div>
        <Input
          label="Short Description"
          value={location.short_description || ""}
          onChange={(e) =>
            setLocation({ ...location, short_description: e.target.value })
          }
        />
        <TextArea
          label="Long Description"
          value={location.long_description || ""}
          onChange={(e) =>
            setLocation({ ...location, long_description: e.target.value })
          }
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={location.featured}
            onChange={(e) =>
              setLocation({ ...location, featured: e.target.checked })
            }
            className="accent-primary"
          />
          <span className="font-body text-sm text-on-surface-variant">
            Featured Location
          </span>
        </label>
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/locations")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
