"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

/**
 * Init AOS once, then refresh on each App Router navigation
 * so observers see the real element positions.
 */
export function AosRouteSync() {
  const pathname = usePathname();
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inited = useRef(false);

  useLayoutEffect(() => {
    if (!inited.current) {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 40,
      });
      inited.current = true;
    }

    const refresh = () => {
      AOS.refresh();
    };

    refresh();
    const raf = requestAnimationFrame(refresh);
    const t1 = setTimeout(refresh, 50);
    const t2 = setTimeout(refresh, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        resizeTimer.current = null;
        AOS.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  return null;
}
