import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Problems } from "@/components/landing/Problems";
import { Solution } from "@/components/landing/Solution";
import { Products } from "@/components/landing/Products";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { DashboardShowcase } from "@/components/landing/DashboardShowcase";
import { AutomationFlow } from "@/components/landing/AutomationFlow";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { PoweredBy } from "@/components/landing/PoweredBy";
import { Register } from "@/components/landing/Register";
import { GsapSmoothScroll } from "@/components/landing/GsapSmoothScroll";

const title = "LPG Agency Management System | LPG Mitra";
const description =
  "Run your LPG agency without the daily chaos. One cloud platform with six apps for deliveries, stock, purchases, cash flow, employees and customers.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "LPG Mitra",
      description,
      inLanguage: "en-IN",
    },
    {
      "@type": "SoftwareApplication",
      name: "LPG Mitra",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      inLanguage: "en-IN",
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "LPG Mitra" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Register", href: "#register" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <GsapSmoothScroll />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav
        links={navLinks}
        tagline="LPG Agency Management"
        cta={{ label: "Register Agency", href: "#register" }}
      />
      <main>
        <Hero />
        <Trust />
        <Problems />
        <Solution />
        <Products />
        <HowItWorks />
        <Benefits />
        <DashboardShowcase />
        <AutomationFlow />
        <FeaturesGrid />
        <Pricing />
        <Testimonials />
        <PoweredBy />
        <Register />
      </main>
    </div>
  );
}
