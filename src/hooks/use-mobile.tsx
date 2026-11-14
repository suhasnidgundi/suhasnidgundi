import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get("view");
    if (viewParam === "mobile" || viewParam === "phone") return true;
    if (viewParam === "desktop") return false;

    const saved = localStorage.getItem("wp_force_view");
    if (saved === "mobile") return true;
    if (saved === "desktop") return false;

    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const checkIsMobile = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view");
      if (viewParam === "mobile" || viewParam === "phone") {
        setIsMobile(true);
        return;
      }
      if (viewParam === "desktop") {
        setIsMobile(false);
        return;
      }

      const saved = localStorage.getItem("wp_force_view");
      if (saved === "mobile") {
        setIsMobile(true);
        return;
      }
      if (saved === "desktop") {
        setIsMobile(false);
        return;
      }

      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkIsMobile);
    window.addEventListener("resize", checkIsMobile);
    window.addEventListener("storage", checkIsMobile);

    return () => {
      mql.removeEventListener("change", checkIsMobile);
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("storage", checkIsMobile);
    };
  }, []);

  return isMobile;
}
