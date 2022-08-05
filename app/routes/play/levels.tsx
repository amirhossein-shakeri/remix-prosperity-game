import { Link, Outlet } from "@remix-run/react";

export default function Levels() {
  return (
    <main>
      <h1>LEVELS SIDEBAR</h1>
      <Link to="LVL_1">Level 1</Link>
      <Outlet />
    </main>
  );
}
