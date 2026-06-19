import { redirect } from "next/navigation";
import { checkAuth } from "@/app/actions/admin";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 border-b border-outline-variant/30 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-sm font-semibold text-primary">Sistem Siaga</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-primary block leading-none">Administrator</span>
              <span className="text-2xs text-on-surface-variant font-medium">Session Active</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-8 bg-surface-container-lowest">
          {children}
        </div>
      </div>
    </div>
  );
}
