import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-black/5">
      {/* top accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl border border-black/5 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700">
          ☕
        </div>
        <div>
          <div className="font-semibold">Neon Café</div>
          <div className="text-[11px] text-stone-500">POS System</div>
        </div>
      </div>

      {/* NAV */}
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
              [
                "px-4 py-2 rounded-xl text-sm font-medium transition border",
                isActive
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-black/5 text-stone-600 hover:bg-stone-100",
              ].join(" ")
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-xl border border-black/5 bg-white hover:bg-stone-100 flex items-center justify-center">
          🔍
        </button>
        <button className="w-10 h-10 rounded-xl border border-black/5 bg-white hover:bg-stone-100 flex items-center justify-center">
          👤
        </button>
      </div>
    </header>
  );
}
