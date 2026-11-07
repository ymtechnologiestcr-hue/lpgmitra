import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

const defaultLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Register", href: "#register" },
];

function NavItem({
  link,
  className,
  onClick,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
}) {
  if (link.href.startsWith("/") && !link.href.startsWith("/#")) {
    return (
      <Link to={link.href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className} onClick={onClick}>
      {link.label}
    </a>
  );
}

export function Nav({
  links = defaultLinks,
  tagline = "LPG Agency Management",
  cta = { label: "Register Agency", href: "#register" },
}: {
  links?: NavLink[];
  tagline?: string;
  cta?: NavLink;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo-mark.png"
            alt="LPG Mitra"
            width={36}
            height={36}
            className="size-9 object-contain"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[16px] font-extrabold tracking-tight text-foreground">
              LPG Mitra
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{tagline}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavItem
              key={l.label}
              link={l}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            />
          ))}
        </div>

        <div className="hidden lg:block">
          <Button variant="brand" size="lg" asChild>
            {cta.href.startsWith("/") && !cta.href.startsWith("/#") ? (
              <Link to={cta.href}>{cta.label}</Link>
            ) : (
              <a href={cta.href}>{cta.label}</a>
            )}
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <NavItem
                key={l.label}
                link={l}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              />
            ))}
          </div>
          <Button variant="brand" size="lg" className="mt-4 w-full" asChild>
            {cta.href.startsWith("/") && !cta.href.startsWith("/#") ? (
              <Link to={cta.href} onClick={() => setOpen(false)}>
                {cta.label}
              </Link>
            ) : (
              <a href={cta.href} onClick={() => setOpen(false)}>
                {cta.label}
              </a>
            )}
          </Button>
        </div>
      )}
    </header>
  );
}