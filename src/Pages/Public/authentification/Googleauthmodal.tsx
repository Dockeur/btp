import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";


interface GoogleAuthModalProps {
  onDismiss: () => void;
}

const STORAGE_KEY = "google_auth_modal_dismissed";

const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          visible ? "opacity-40" : "opacity-0"
        }`}
        onClick={handleDismiss}
      />

      <div
        className={`fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2
          w-full sm:w-[420px] transition-all duration-300 ease-out
          ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-1.5 w-full bg-Cprimary" />

          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                <FcGoogle className="text-3xl" />
              </div>
            </div>

            <h2 className="text-center text-gray-900 font-semibold text-lg font-poppins">
              Connexion rapide avec Google
            </h2>
            <p className="text-center text-gray-500 text-sm mt-1.5 leading-relaxed">
              Accédez à votre compte en un clic sans avoir à retenir un mot de passe.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
                  border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100
                  text-gray-700 font-medium text-sm transition-colors shadow-sm"
              >
                <FcGoogle className="text-xl flex-shrink-0" />
                Continuer avec Google
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Non merci, continuer sans Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { STORAGE_KEY };
export default GoogleAuthModal;