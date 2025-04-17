import { getAllOrders } from "@/actions/order-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus, PaymentStatus } from "@prisma/client";

async function Page() {
  const { data: orders } = await getAllOrders();
  console.log(orders);

  return (
    <section>
      <h1 className="text-xl font-semibold">Pedidos</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-left">Metodo de pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {orders &&
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium">{order.user.name}</p>
                    <p>{order.user.email}</p>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={order.status}>
                      <SelectTrigger className="w-[120px] text-xs h-8">
                        <SelectValue placeholder="estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={OrderStatus.PENDING_PAYMENT}>
                          Pendiente
                        </SelectItem>
                        <SelectItem value={OrderStatus.PAID}>Pagado</SelectItem>
                        <SelectItem value={OrderStatus.CANCELLED_PAYMENT}>
                          Pago cancelado
                        </SelectItem>
                        <SelectItem value={OrderStatus.CANCELLED}>
                          Cancelado
                        </SelectItem>
                        <SelectItem value={OrderStatus.DELIVERED}>
                          Entregado
                        </SelectItem>
                        <SelectItem value={OrderStatus.SHIPPED}>
                          Enviado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-left">
                    {order.payment?.method}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
export default Page;
