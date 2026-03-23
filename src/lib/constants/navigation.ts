export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const ROUTES = {
  home: "/",
  locations: "/locations",
  location: (slug: string) => `/locations/${slug}`,
  admin: "/admin",
  adminLogin: "/admin/login",
  adminLocations: "/admin/locations",
  adminEditLocation: (id: string) => `/admin/locations/${id}`,
  adminPhotos: "/admin/photos",
  adminUpload: "/admin/photos/upload",
  adminProfile: "/admin/profile",
} as const;
