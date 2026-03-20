import { useEffect, useState } from "react";
import { STORAGE_KEY } from "./Googleauthmodal";



const useGoogleAuthModal = (isAuthenticated: boolean) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setShowModal(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const dismissModal = () => setShowModal(false);

  return { showModal, dismissModal };
};

export default useGoogleAuthModal;