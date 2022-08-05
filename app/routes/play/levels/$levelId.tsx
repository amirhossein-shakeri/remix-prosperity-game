import { Link, Outlet } from "@remix-run/react";

export default function Level() {
  return (
    <main>
      <h1>ITEMS SIDEBAR</h1>
      <Link to="ITM_1">Item 1</Link>
      <Outlet />
    </main>
  );
}
