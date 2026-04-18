import { Outlet } from "react-router-dom";
import { MobileNavbar } from "./MobileNavbar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <MobileNavbar />
    </div>
  );
}
