import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SidebarDashboard from "./ui/sidebar-dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log(session);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <div className="flex min-h-screen">
        <SidebarDashboard />
        <main className="flex-1 p-4 px-8">{children}</main>
      </div>
    </>
  );
}
