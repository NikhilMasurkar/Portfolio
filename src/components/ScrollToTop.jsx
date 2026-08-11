import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // ponytail: instant, not smooth — a route change should land at the top,
    // not animate a long scroll the visitor didn't ask for.
    window.scrollTo(0, 0);
  }, [location]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;
