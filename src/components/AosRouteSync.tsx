import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";

/**
 * AOS runs once in main.tsx before React paints. Re-scan after each navigation
 * and after layout so mobile observers see the real element positions.
 */
export function AosRouteSync() {
  const { pathname } = useLocation();
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
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
