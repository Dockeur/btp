import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { routes } from "src/routes";

export const ProtectedRoute = ({
  permissions,
  children,
  verified = true,
}: any) => {
  const location = useLocation();
  const { getToken, auth, hasPermission }: any = useAuth(); 
  
  const token = getToken();


  if (!token) {
    return (
      <Navigate to={routes.login.path} state={{ from: location }} replace />
    );
  }

  // 2. Vérification de l'email
  // IMPORTANT : 'auth' contient déjà l'utilisateur, donc on utilise auth.email_verified_at
  if (verified && !auth) {
    console.log("contenu des variables verified email_verified token", verified, auth?.email_verified_at);
    return (
      <Navigate
        to={routes.validateUser.path}
        state={{ from: location }}
        replace
      />
    );
  }

  // 3. Vérification des permissions
  if (permissions && !hasPermission(permissions)) {
    return (
      <Navigate
        to={routes.unauthorized.path}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};