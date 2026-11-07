import { BadgeCheck, ShieldCheck, Layers, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

const badges = [
  { icon: BadgeCheck, label: "Enterprise Ready" },
  { icon: ShieldCheck, label: "Cloud Secure" },
  { icon: Layers, label: "Scalable Platform" },
  { icon: Headphones, label: "Expert Support" },
];

export function PoweredBy() {
  return (
    <>
      <section id="about" className="section-pad border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Powered by LPG Mitra
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
              Built by <span className="gradient-text">LPG Mitra</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              LPG Mitra develops enterprise software solutions that help businesses digitize
              operations and improve efficiency. Our LPG Agency Management System is purpose-built
              for gas distributors to streamline operations, increase visibility, improve
              productivity, and simplify everyday management.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((b, i) => (
              <Reveal key={b.label} delay={i * 80}>
                <div className="surface-card flex flex-col items-center gap-2.5 p-6">
                  <b.icon className="size-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{b.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[28px] px-8 py-16 text-center md:px-16 md:py-20"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-primary-foreground md:text-5xl">
                Ready to Digitize Your LPG Agency?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                Join modern LPG agencies that are reducing manual work, improving productivity, and
                managing every operation from one intelligent platform.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="soft" size="xl" asChild>
                  <a href="#register">Register Agency</a>
                </Button>
                <Button
                  size="xl"
                  variant="ghost"
                  className="border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  asChild
                >
                  <a href="#register">Book Free Demo</a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}