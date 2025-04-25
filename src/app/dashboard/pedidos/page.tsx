import { getAllOrders } from "@/actions/order-action";
import TableOrder from "../ui/table-order";

async function Page() {
  const { data: orders } = await getAllOrders();

  return (
    <section>
      <h1 className="text-xl font-semibold">Pedidos</h1>
      {orders && orders.length > 0 ? (
        <TableOrder orders={orders} />
      ) : (
        <h3>No hay pedidos registrados</h3>
      )}
    </section>
  );
}
export default Page;
