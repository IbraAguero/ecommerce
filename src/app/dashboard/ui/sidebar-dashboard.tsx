import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  {
    title: "Productos",
    href: "/productos",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Pedidos",
    href: "/pedidos",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
];

function SidebarDashboard() {
  return (
    <div className="hidden border-r bg-zinc-400 md:block md:w-64">
      <div className="flex flex-col h-full gap-2 py-2">
        <div className="flex items-center justify-center p-2 border-b">
          <h2 className="font-semibold">Eccomerce-Admin</h2>
        </div>
        <div className="flex-1 overflow-auto space-y-2 p-2">
          <nav className="grid items-start gap-2">
            {sidebarItems.map((item) => (
              <Link href={`/dashboard${item.href}`} key={item.title}>
                <Button className="w-full justify-start" variant="link">
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-2">
          <Link href="/">
            <Button className="w-full">Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default SidebarDashboard;
