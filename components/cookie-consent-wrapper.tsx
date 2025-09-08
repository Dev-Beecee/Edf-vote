"use client";

import { CookieConsent } from "@/components/cookie-consent";

export function CookieConsentWrapper() {
  const handleAccept = () => {
    // Recharger la page pour activer Google Analytics
    window.location.reload();
  };

  const handleDecline = () => {
    console.log('Cookies refusés');
  };

  return (
    <CookieConsent 
      variant="default"
      onAcceptCallback={handleAccept}
      onDeclineCallback={handleDecline}
    />
  );
}
