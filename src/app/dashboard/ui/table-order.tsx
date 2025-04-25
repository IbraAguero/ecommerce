import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parsedPrice } from "@/lib/utils";
import { Order } from "@prisma/client";
import SelectStatus from "../pedidos/ui/SelectStatus";

interface Props {
  orders: Order[];
}

function TableOrder({ orders }: Props) {
  const totalAmount = orders?.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-left">Pago</TableHead>
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
                <SelectStatus orderId={order.id} value={order.status} />
              </TableCell>
              <TableCell className="text-left">
                {order.payment?.method} | {order.payment?.status}
              </TableCell>
              <TableCell className="text-right">{order.totalAmount}</TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">
            {parsedPrice(totalAmount || 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
export default TableOrder;
