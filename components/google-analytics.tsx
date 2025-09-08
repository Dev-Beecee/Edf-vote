"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Fonction pour vérifier le consentement des cookies
    const checkCookieConsent = () => {
      return document.cookie.includes("cookieConsent=true");
    };

    // Initialiser Google Analytics seulement si le consentement est donné
    if (checkCookieConsent()) {
      // Initialiser gtag si pas déjà fait
      if (typeof window !== "undefined" && !window.gtag) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId);
      }
    }
  }, [measurementId]);

  // Ne pas charger les scripts si le consentement n'est pas donné
  if (typeof window !== "undefined" && !document.cookie.includes("cookieConsent=true")) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

// Hook pour utiliser gtag dans les composants
export function useGoogleAnalytics() {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== "undefined" && window.gtag && document.cookie.includes("cookieConsent=true")) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (page_path: string) => {
    if (typeof window !== "undefined" && window.gtag && document.cookie.includes("cookieConsent=true")) {
      window.gtag('config', 'G-6DBHXRXEHP', {
        page_path: page_path,
      });
    }
  };

  return { trackEvent, trackPageView };
}
