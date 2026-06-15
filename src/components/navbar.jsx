import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "12px", padding: "10px" }}>
      <Link to="/">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/mood-tracker">Mood Tracker</Link>
      <Link to="/journal">Journal</Link>
      <Link to="/habits">Habits</Link>
      <Link to="/emergency-support">Emergency</Link>
      <Link to="/disclaimer">Disclaimer</Link>
    </nav>
  );
}