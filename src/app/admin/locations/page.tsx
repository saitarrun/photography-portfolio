"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useDropzone } from "react-dropzone";
import type { Location } from "@/types/database";
import { slugify } from "@/lib/utils/format";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_description: "",
    long_description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

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
    loadLocations();
  }, []);

  async function loadLocations() {
    const supabase = createClient();
    const { data } = await supabase
      .from("locations")
      .select("*")
      .order("display_order");
    if (data) setLocations(data as unknown as Location[]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    const supabase = createClient();
    
    try {
      let coverImageUrl = null;

      // 1. Upload cover if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cover-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `new-locations/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
        
        coverImageUrl = publicUrl;
      }

      // 2. Insert location
      const { error } = await supabase.from("locations").insert({
        ...formData,
        slug: formData.slug || slugify(formData.name),
        cover_image_url: coverImageUrl,
        display_order: locations.length,
      } as never);

      if (error) throw error;

      setShowForm(false);
      setFormData({ name: "", slug: "", short_description: "", long_description: "" });
      setFile(null);
      setPreview("");
      loadLocations();
    } catch (err: any) {
      alert(err.message || "Error creating location");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this location and all its photos?")) return;
    const supabase = createClient();
    await supabase.from("locations").delete().eq("id", id);
    loadLocations();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Locations
        </h1>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Location"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-12 bg-surface-highest p-6 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: slugify(e.target.value),
                })
              }
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>
          <Input
            label="Short Description"
            value={formData.short_description}
            onChange={(e) =>
              setFormData({ ...formData, short_description: e.target.value })
            }
          />
          <TextArea
            label="Long Description"
            value={formData.long_description}
            onChange={(e) =>
              setFormData({ ...formData, long_description: e.target.value })
            }
          />

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
              {preview ? (
                <div className="relative aspect-[16/6] md:aspect-[21/7] max-w-2xl mx-auto overflow-hidden rounded-xl">
                  <Image 
                    src={preview} 
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

          <Button type="submit" variant="primary" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Location"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center gap-4 bg-surface-highest p-4"
          >
            {loc.cover_image_url && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden">
                <Image
                  src={loc.cover_image_url}
                  alt={loc.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm text-on-surface truncate">
                {loc.name}
              </p>
              <p className="font-body text-[10px] text-on-surface-variant truncate">
                /{loc.slug}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href={`/admin/locations/${loc.id}`}
                className="font-body text-xs text-on-surface-variant hover:text-on-surface"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(loc.id)}
                className="font-body text-xs text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {locations.length === 0 && (
          <p className="font-body text-sm text-on-surface-variant py-8 text-center">
            No locations yet. Add your first location above.
          </p>
        )}
      </div>
    </div>
  );
}
