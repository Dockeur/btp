import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    handleGoogleOneTapCredential: (response: { credential: string }) => void;
  }
}

interface GoogleOneTapProps {
  onCredential: (credential: string) => void;
  onSkip?: () => void;
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onCredential, onSkip }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("[GoogleOneTap] VITE_GOOGLE_CLIENT_ID manquant dans .env");
      onSkip?.();
      return;
    }

    window.handleGoogleOneTapCredential = (response) => {
      if (response?.credential) {
        onCredential(response.credential);
      }
    };

    const initOneTap = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleGoogleOneTapCredential,
        auto_select: true,
        cancel_on_tap_outside: true,
        context: "signin",
        itp_support: true,
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          // Cooldown actif, origine non autorisée, pas de session Google, etc.
          console.warn("[GoogleOneTap] Non affiché:", reason);
          onSkip?.();
          return;
        }

        if (notification.isSkippedMoment()) {
          const reason = notification.getSkippedReason();
          // "user_cancel" | "issuing_failed" | "auto_cancel"
          console.warn("[GoogleOneTap] Ignoré:", reason);
          onSkip?.();
          return;
        }

        if (notification.isDismissedMoment()) {
          const reason = notification.getDismissedReason();
          // "credential_returned" = succès normal, ne pas appeler onSkip
          if (reason !== "credential_returned") {
            console.warn("[GoogleOneTap] Fermé:", reason);
            onSkip?.();
          }
        }
      });
    };

    if (window.google?.accounts?.id) {
      initOneTap();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initOneTap;
      script.onerror = () => {
        console.warn("[GoogleOneTap] Échec chargement script GSI");
        onSkip?.();
      };
      document.head.appendChild(script);
    }

    return () => {
      window.google?.accounts?.id?.cancel();
    };
  }, []);

  return null;
};

export default GoogleOneTap;