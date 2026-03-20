import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { verifyGoogleToken } from "src/services/AuthService";
import { routes } from "src/routes";

const GoogleCallback: React.FC = () => {
    const [status, setStatus] = useState<"loading" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setErrorMsg("Aucun token reçu. Veuillez réessayer.");
            setStatus("error");
            return;
        }

        (async () => {
            try {
                const res = await verifyGoogleToken(token);

                if (res.success && res.data?.user) {
                    loginWithToken(res.data.token ?? token, res.data.user);
                    navigate(routes.home.path, { replace: true });
                } else {
                    setErrorMsg("Authentification échouée. Veuillez réessayer.");
                    setStatus("error");
                }
            } catch (err: any) {
                console.error("Erreur callback Google:", err);
                setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
                setStatus("error");
            }
        })();
    }, []);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-Cprimary animate-spin" />
                <p className="text-gray-500 font-poppins text-sm">
                    Connexion avec Google en cours…
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4 p-4">
            <div className="max-w-sm w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-semibold text-base">{errorMsg}</p>
                <button
                    onClick={() => navigate(routes.login.path)}
                    className="mt-4 text-sm text-Cprimary underline hover:opacity-75 transition-opacity"
                >
                    Retour à la connexion
                </button>
            </div>
        </div>
    );
};

export default GoogleCallback;