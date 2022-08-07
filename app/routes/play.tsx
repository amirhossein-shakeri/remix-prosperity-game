import { Outlet } from "@remix-run/react";
import DashboardNav from "~/components/DashboardNav";

export default function Dashboard() {
  return (
    <main>
      {/* Game Dashboard */}
      <DashboardNav />
      <Outlet />
    </main>
  );
}
