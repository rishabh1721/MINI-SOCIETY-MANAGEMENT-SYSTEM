import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--card)] border-r border-[var(--border)]
        p-6 flex flex-col transition-transform md:static md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10">
          <h2 className="text-lg font-semibold">Sushila Buildcon</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Admin Panel
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            ["/dashboard", "Dashboard"],
            ["/flats", "Flats"],
            ["/maintenance", "Maintenance"],
            ["/payments", "Payments"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-[color-mix(in_oklch,var(--primary)_20%,transparent)] font-medium"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto text-sm text-[var(--destructive)]"
        >
          Sign out
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">
        <button
          className="mb-4 md:hidden text-sm border px-3 py-1 rounded"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
        {children}
      </main>
    </div>
  );
}