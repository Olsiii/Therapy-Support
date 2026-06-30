import { NavLink } from "react-router-dom";


export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo"></span>
        <span className="navbar-name">TherapySupport</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/mood-tracker" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Mood Tracker
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Journal
        </NavLink>
        <NavLink to="/habits" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Habits
        </NavLink>
        <NavLink to="/emergency-support" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Emergency
        </NavLink>
        <NavLink to="/disclaimer" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Disclaimer
        </NavLink>
      </div>

      <div className="navbar-auth">
        <NavLink to="/login" className="btn-outline">Log in</NavLink>
        <NavLink to="/register" className="btn-primary">Sign up</NavLink>
      </div>
    </nav>
  );
}
