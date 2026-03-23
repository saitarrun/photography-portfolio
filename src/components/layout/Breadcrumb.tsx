import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em]">
        <li>
          <Link
            href="/"
            className="text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-outline-variant">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-on-surface">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
