import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function GsapSmoothScroll() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", hash);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      gsap.to(window, {
        duration: 1.1,
        ease: "power3.inOut",
        overwrite: "auto",
        scrollTo: { y: target, offsetY: 84, autoKill: true },
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
