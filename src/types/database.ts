export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          long_description: string | null;
          cover_image_url: string | null;
          display_order: number;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          short_description?: string | null;
          long_description?: string | null;
          cover_image_url?: string | null;
          display_order?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          long_description?: string | null;
          cover_image_url?: string | null;
          display_order?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_location_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "photos";
            referencedColumns: ["location_id"];
          },
        ];
      };
      photos: {
        Row: {
          id: string;
          location_id: string;
          image_url: string;
          title: string | null;
          caption: string | null;
          alt_text: string | null;
          shot_date: string | null;
          camera: string | null;
          lens: string | null;
          aperture: string | null;
          iso: number | null;
          shutter_speed: string | null;
          focal_length: string | null;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          image_url: string;
          title?: string | null;
          caption?: string | null;
          alt_text?: string | null;
          shot_date?: string | null;
          camera?: string | null;
          lens?: string | null;
          aperture?: string | null;
          iso?: number | null;
          shutter_speed?: string | null;
          focal_length?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          image_url?: string;
          title?: string | null;
          caption?: string | null;
          alt_text?: string | null;
          shot_date?: string | null;
          camera?: string | null;
          lens?: string | null;
          aperture?: string | null;
          iso?: number | null;
          shutter_speed?: string | null;
          focal_length?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
      photographer_profile: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          portrait_url: string | null;
          email: string | null;
          social_links: Json;
          achievements: Json;
          experience: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          portrait_url?: string | null;
          email?: string | null;
          social_links?: Json;
          achievements?: Json;
          experience?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          portrait_url?: string | null;
          email?: string | null;
          social_links?: Json;
          achievements?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      photo_tags: {
        Row: {
          photo_id: string;
          tag_id: string;
        };
        Insert: {
          photo_id: string;
          tag_id: string;
        };
        Update: {
          photo_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photo_tags_photo_id_fkey";
            columns: ["photo_id"];
            isOneToOne: false;
            referencedRelation: "photos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "photo_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type LocationInsert = Database["public"]["Tables"]["locations"]["Insert"];
export type LocationUpdate = Database["public"]["Tables"]["locations"]["Update"];

export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type PhotoInsert = Database["public"]["Tables"]["photos"]["Insert"];
export type PhotoUpdate = Database["public"]["Tables"]["photos"]["Update"];

export type PhotographerProfile = Database["public"]["Tables"]["photographer_profile"]["Row"];
export type PhotographerProfileUpdate = Database["public"]["Tables"]["photographer_profile"]["Update"];

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
