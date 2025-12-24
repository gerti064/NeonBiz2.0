import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="posNav">
      <div className="posNavBrand">
        <div className="brandMark">GC</div>
        <div className="brandTitle">Green Grounds Coffee</div>
      </div>

      <nav className="posNavLinks">
        <NavLink to="/products" className={({ isActive }) => `posNavLink ${isActive ? "active" : ""}`}>
          Products
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `posNavLink ${isActive ? "active" : ""}`}>
          Orders
        </NavLink>
        <NavLink to="/statistics" className={({ isActive }) => `posNavLink ${isActive ? "active" : ""}`}>
          Statistics
        </NavLink>
      </nav>

      <div className="posNavRight">
        <button className="avatar">G</button>
      </div>
    </header>
  );
}
