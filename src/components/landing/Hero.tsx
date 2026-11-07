import {
  IndianRupee,
  Package,
  Truck,
  Wallet,
  Receipt,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Counter } from "./Reveal";
import dashboard from "@/assets/owner-dashboard.jpg";
import apps from "@/assets/mobile-apps.png";

const widgets = [
  { icon: IndianRupee, label: "Today's Revenue", value: "₹48,750" },
  { icon: Package, label: "Cylinder Inventory", value: "1,250" },
  { icon: Truck, label: "Today's Deliveries", value: "86" },
  { icon: Wallet, label: "Cash Collection", value: "₹38,600" },
  { icon: Receipt, label: "Expenses", value: "₹6,240" },
  { icon: BarChart3, label: "Business Analytics", value: "Live" },
  { icon: Users, label: "Employee Performance", value: "92%" },
  { icon: Activity, label: "Recent Activities", value: "24 new" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-[0.09]"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 size-[720px] -translate-x-1/2 rounded-full blur-3xl opacity-25"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Built for LPG distributors by LPG Mitra
          </span>

          <h1 className="mt-7 animate-rise text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Run Your LPG Agency <span className="gradient-text">Without the Daily Chaos</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-rise text-lg font-semibold text-foreground/80 md:text-xl">
            One Platform. Six Powerful Applications. Complete Control.
          </p>

          <p className="mx-auto mt-4 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground md:text-lg">
            Manage deliveries, stock, purchases, cash flow, employees, customers, and every agency
            operation from one cloud-based platform built specifically for LPG agencies.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="brand" size="xl" asChild>
              <a href="#register">Register Your Agency</a>
            </Button>
            <Button variant="soft" size="xl" asChild>
              <a href="#register">Book Free Demo</a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="glass-card overflow-hidden p-2 md:p-3">
            <img
              src={dashboard}
              alt="Owner dashboard showing revenue, cylinder inventory, deliveries and cash collection for an LPG agency"
              width={1600}
              height={1008}
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-[16px]"
            />
          </div>

          <img
            src={apps}
            alt="Customer, delivery agent and godown manager mobile apps"
            width={1408}
            height={1008}
            loading="lazy"
            className="mx-auto mt-[-6%] w-[92%] animate-float drop-shadow-2xl md:mt-[-9%] md:w-[78%]"
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {widgets.map((w) => (
            <div key={w.label} className="surface-card flex items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <w.icon className="size-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-muted-foreground">
                  {w.label}
                </span>
                <span className="block text-sm font-bold text-foreground">{w.value}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-[24px] border border-border bg-secondary/50 p-8 sm:grid-cols-3">
          {[
            { to: 6, suffix: "", label: "Connected applications" },
            { to: 100, suffix: "%", label: "Cloud-based & real-time" },
            { to: 6, suffix: " hrs", label: "Saved every single day" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-foreground md:text-4xl">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
