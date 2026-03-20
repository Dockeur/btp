import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import { useAuthStore } from "@/hooks/useAuth";
import { verifyBackendToken } from "@/services/AuthService";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await verifyBackendToken(token);

        if (res.success && res.data?.user) {
          // ✅ Stockage identique à l'auth normale
          loginWithToken(res.data.token ?? token, res.data.user);
          navigate("/", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-Cprimary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default AuthCallback;