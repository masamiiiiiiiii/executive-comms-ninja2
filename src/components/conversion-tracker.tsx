"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

export function ConversionTracker() {
    const searchParams = useSearchParams();
    const hasFired = useRef(false);

    useEffect(() => {
        const isSuccess = searchParams?.get("payment_success") === "true";
        
        if (isSuccess && !hasFired.current) {
            hasFired.current = true;
            
            // Fire the specific Google Ads conversion event precisely via gtag configuration.
            // Note: sendGAEvent uses dataLayer.push internally to broadcast exactly to the tags connected.
            sendGAEvent("event", "conversion", {
                send_to: "AW-17979887612/jvSACIGP3v8bEPyfvf1C",
                value: 49.0,
                currency: "USD"
            });
            
            // Note: As an enhancement, I've commented out the URL cleaner because Google Ads attribution 
            // sometimes relies on full URLs residing in browser history momentarily.
            // if (typeof window !== "undefined") {
            //   const url = new URL(window.location.href);
            //   url.searchParams.delete("payment_success");
            //   window.history.replaceState({}, '', url.toString());
            // }
        }
    }, [searchParams]);

    return null; // This component doesn't render anything visually
}
