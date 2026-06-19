import { redirect } from "next/navigation";
import { checkAuth } from "@/app/actions/admin";

export default async function AdminPage() {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}
