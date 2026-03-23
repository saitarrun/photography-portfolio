export type {
  Location,
  LocationInsert,
  LocationUpdate,
  Photo,
  PhotoInsert,
  PhotoUpdate,
  PhotographerProfile,
  PhotographerProfileUpdate,
  Tag,
  Database,
} from "./database";

export type LocationWithCount = import("./database").Location & {
  photo_count: number;
};

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  email?: string;
  [key: string]: string | undefined;
}
