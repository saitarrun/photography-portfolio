"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import type { Photo, Location } from "@/types/database";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    preview: "",
    title: "",
    caption: "",
    alt_text: "",
    camera: "",
    lens: "",
    aperture: "",
    iso: "",
    shutter_speed: "",
    focal_length: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file)
      }));
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

  useEffect(() => {
    if (selectedLocation) loadPhotos(selectedLocation);
  }, [selectedLocation]);

  async function loadLocations() {
    const supabase = createClient();
    const { data } = await supabase
      .from("locations")
      .select("*")
      .order("display_order");
    if (data) {
      const locs = data as unknown as Location[];
      setLocations(locs);
      if (locs.length > 0) setSelectedLocation(locs[0].id);
    }
  }

  async function loadPhotos(locationId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("photos")
      .select("*")
      .eq("location_id", locationId)
      .order("display_order");
    if (data) setPhotos(data as unknown as Photo[]);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLocation || !uploadData.file) return;

    setIsUploading(true);
    const supabase = createClient();

    try {
      // 1. Upload to Storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${selectedLocation}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('photos')
        .upload(filePath, uploadData.file);

      if (storageError) throw storageError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase.from("photos").insert({
        location_id: selectedLocation,
        image_url: publicUrl,
        title: uploadData.title || null,
        caption: uploadData.caption || null,
        alt_text: uploadData.alt_text || null,
        camera: uploadData.camera || null,
        lens: uploadData.lens || null,
        aperture: uploadData.aperture || null,
        iso: uploadData.iso ? parseInt(uploadData.iso) : null,
        shutter_speed: uploadData.shutter_speed || null,
        focal_length: uploadData.focal_length || null,
        display_order: photos.length,
      } as never);

      if (dbError) throw dbError;

      setShowUpload(false);
      setUploadData({
        file: null,
        preview: "",
        title: "",
        caption: "",
        alt_text: "",
        camera: "",
        lens: "",
        aperture: "",
        iso: "",
        shutter_speed: "",
        focal_length: "",
      });
      loadPhotos(selectedLocation);
    } catch (err: any) {
      alert(err.message || "Error uploading photo");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    const supabase = createClient();
    await supabase.from("photos").delete().eq("id", id);
    if (selectedLocation) loadPhotos(selectedLocation);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Photos
        </h1>
        <Button variant="primary" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? "Cancel" : "Add Photo"}
        </Button>
      </div>

      {/* Location filter */}
      <div className="mb-8">
        <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">
          Location
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="bg-surface-highest text-on-surface font-body text-sm px-4 py-2 border-0 outline-none"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload form */}
      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="mb-12 bg-surface-highest p-6 space-y-6"
        >
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer rounded-2xl ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50 bg-white/[0.02]'
            }`}
          >
            <input {...getInputProps()} />
            {uploadData.preview ? (
              <div className="relative aspect-video max-w-md mx-auto overflow-hidden rounded-xl">
                <Image 
                  src={uploadData.preview} 
                  alt="Preview" 
                  fill 
                  className="object-cover" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-body">Click or drag to change</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-body text-sm text-on-surface">
                  {isDragActive ? "Drop the image here" : "Drag and drop an image, or click to select"}
                </p>
                <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                  High-res JPG or PNG (Max 100MB)
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Title"
              value={uploadData.title}
              onChange={(e) =>
                setUploadData({ ...uploadData, title: e.target.value })
              }
            />
            <Input
              label="Alt Text"
              value={uploadData.alt_text}
              onChange={(e) =>
                setUploadData({ ...uploadData, alt_text: e.target.value })
              }
            />
          </div>
          <Input
            label="Caption"
            value={uploadData.caption}
            onChange={(e) =>
              setUploadData({ ...uploadData, caption: e.target.value })
            }
          />
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            EXIF Metadata
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Input
              label="Camera"
              value={uploadData.camera}
              onChange={(e) =>
                setUploadData({ ...uploadData, camera: e.target.value })
              }
            />
            <Input
              label="Lens"
              value={uploadData.lens}
              onChange={(e) =>
                setUploadData({ ...uploadData, lens: e.target.value })
              }
            />
            <Input
              label="Aperture"
              value={uploadData.aperture}
              onChange={(e) =>
                setUploadData({ ...uploadData, aperture: e.target.value })
              }
            />
            <Input
              label="ISO"
              value={uploadData.iso}
              onChange={(e) =>
                setUploadData({ ...uploadData, iso: e.target.value })
              }
            />
            <Input
              label="Shutter Speed"
              value={uploadData.shutter_speed}
              onChange={(e) =>
                setUploadData({ ...uploadData, shutter_speed: e.target.value })
              }
            />
            <Input
              label="Focal Length"
              value={uploadData.focal_length}
              onChange={(e) =>
                setUploadData({ ...uploadData, focal_length: e.target.value })
              }
            />
          </div>
          <Button type="submit" variant="primary" disabled={isUploading || !uploadData.file}>
            {isUploading ? "Uploading..." : "Publish Photograph"}
          </Button>
        </form>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={photo.image_url}
                alt={photo.alt_text || photo.title || "Photo"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-body text-xs text-on-surface-variant truncate">
                {photo.title || "Untitled"}
              </p>
              <button
                onClick={() => handleDelete(photo.id)}
                className="font-body text-[10px] text-red-400 hover:text-red-300 shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && selectedLocation && (
        <p className="font-body text-sm text-on-surface-variant py-8 text-center">
          No photos for this location yet.
        </p>
      )}
    </div>
  );
}
