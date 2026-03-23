import Link from "next/link";

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Locations", href: "/admin/locations" },
  { label: "Photos", href: "/admin/photos" },
  { label: "Profile", href: "/admin/profile" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh pt-20">
      <div className="mx-auto max-w-[1600px] flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-outline-variant/15 px-6 py-8">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mb-6">
            Admin Panel
          </p>
          <nav className="flex flex-col gap-3">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 px-6 md:px-12 py-8">{children}</div>
      </div>
    </div>
  );
}
