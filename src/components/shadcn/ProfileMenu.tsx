import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/routes";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Text, Avatar } from "rizzui";

export default function ProfileMenu() {
  const { auth, logout } = useAuth(); // ✅ Utiliser auth au lieu de getAuth()
  const navigate = useNavigate();

  // ✅ Vérification de sécurité
  if (!auth) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate(routes.home.path, { replace: true });
  };

  // ✅ Préparer les données avec des valeurs par défaut
  const firstName = auth.first_name || "Utilisateur";
  const lastName = auth.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = auth.email || "";
  const profileImage = auth.profile?.avatar || auth.profile?.image || null;

  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <Avatar
          name={fullName}
          src={profileImage}
          className="cursor-pointer"
        />
      </Dropdown.Trigger>
      <Dropdown.Menu className="w-auto !bg-white !rounded-lg divide-y mt-2 backdrop-blur-lg shadow-lg">
        <Dropdown.Item className="hover:bg-transparent">
          <Avatar
            name={fullName}
            src={profileImage}
          />
          <span className="ml-2 text-start">
            <Text className="text-gray-900 font-bold leading-tight">
              {fullName}
            </Text>
            <Text className="text-slate-700">{email}</Text>
          </span>
        </Dropdown.Item>
        <div className="mt-3 mb-2 pt-2">
          <Dropdown.Item className="hover:bg-slate-200 hover:text-slate-600">
            <Link to={routes.profile.path}>Mon compte</Link>
          </Dropdown.Item>
          <Dropdown.Item className="hover:bg-slate-200 hover:text-slate-600">
            {/* <Link to={routes.gestion.path}>Gestion</Link> */}
          </Dropdown.Item>
          <Dropdown.Item className="hover:bg-slate-200 hover:text-slate-600">
            Support
          </Dropdown.Item>
          <Dropdown.Item className="hover:bg-slate-200 hover:text-slate-600">
            License
          </Dropdown.Item>
        </div>
        <div className="mt-2 pt-2">
          <Dropdown.Item
            onClick={handleLogout}
            className="hover:bg-slate-200 hover:text-slate-600"
          >
            Se déconnecter
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}