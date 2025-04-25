"use client";
import { changeStatusOrder } from "@/actions/order-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

interface Props {
  orderId: string;
  value: OrderStatus;
}

function SelectStatus({ orderId, value }: Props) {
  const onChange = async (value: OrderStatus) => {
    const res = await changeStatusOrder(orderId, value);

    if (res.success) {
      toast.success("Se cambio correctamente el estado");
    }
  };

  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px] text-xs h-8">
        <SelectValue placeholder="estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OrderStatus.PENDING}>Pendiente</SelectItem>
        <SelectItem value={OrderStatus.CANCELLED}>Cancelado</SelectItem>
        <SelectItem value={OrderStatus.DELIVERED}>Entregado</SelectItem>
        <SelectItem value={OrderStatus.SHIPPED}>Enviado</SelectItem>
      </SelectContent>
    </Select>
  );
}
export default SelectStatus;
