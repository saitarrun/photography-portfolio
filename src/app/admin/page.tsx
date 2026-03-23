import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface mb-2">
        Dashboard
      </h1>
      <p className="font-body text-sm text-on-surface-variant mb-12">
        Manage your photography portfolio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Locations",
            description: "Manage your location collections",
            href: "/admin/locations",
          },
          {
            title: "Photos",
            description: "Direct upload and gallery management",
            href: "/admin/photos",
          },
          {
            title: "Profile",
            description: "Edit your photographer profile",
            href: "/admin/profile",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block bg-surface-highest p-6 transition-colors hover:bg-surface-bright"
          >
            <h2 className="font-display text-lg text-on-surface mb-1">
              {card.title}
            </h2>
            <p className="font-body text-xs text-on-surface-variant">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
