"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AdSenseScript() {
  const { data: session } = useSession();

  useEffect(() => {
    // Only load AdSense for non-paid users
    const shouldLoadAds =
      !session?.user?.subscription || session.user.subscription === "FREE";

    if (
      shouldLoadAds &&
      !document.querySelector('script[src*="adsbygoogle.js"]')
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6300047399627327";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, [session?.user?.subscription]);

  return null;
}
