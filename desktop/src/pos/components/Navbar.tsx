import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="h-14 bg-emerald-500 text-white flex items-center justify-between px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold">
          ☕
        </div>
        <span className="font-semibold tracking-tight">
          Neon Café
        </span>
      </div>

      {/* CENTER NAV */}
      <nav className="flex gap-2">
        {[
          { to: "/products", label: "Favorites" },
          { to: "/orders", label: "Orders" },
          { to: "/statistics", label: "Stats" },
        ].map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-white text-emerald-600"
                  : "text-white/90 hover:bg-white/20"
              }
            `
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          🔍
        </button>
        <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          👤
        </button>
      </div>
    </header>
  );
}
