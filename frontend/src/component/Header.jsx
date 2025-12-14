import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKENDURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initial = (user?.name || "U").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur-xl bg-white/70 border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,var(--c1),var(--c2))] shadow-sm" />
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight text-slate-900">
                SweetShop
              </div>
              <div className="text-xs text-slate-500">Inventory • Purchase • Admin</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user?.isAdmin ? (
              <Link to="/add-sweet" className="btn btn-outline">
                <span className="h-2 w-2 rounded-full bg-[color:var(--c1)]" />
                Add Sweet
              </Link>
            ) : null}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/60 px-3 py-2">
                  <div className="h-8 w-8 rounded-xl bg-[linear-gradient(135deg,var(--c1),var(--c2))] text-white flex items-center justify-center font-bold">
                    {initial}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 max-w-[180px] truncate">
                    {user?.name}
                  </div>
                </div>

                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header
