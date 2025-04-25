"use client";

import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getPriceRange } from "@/lib/utils";
import { Category, Product, ProductVariant } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import VariantsDialog from "./variants-dialog";

type Products = Product & { variants: ProductVariant[]; category: Category };

export const columns: ColumnDef<Products>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "image",
    header: "Imagen",
    cell: ({ row }) => {
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-md">
          <Image
            src={row.original.images[0]}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Producto",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
  },
  {
    header: "Precio",
    cell: ({ row }) => {
      return <div>{getPriceRange(row.original.variants)}</div>;
    },
  },
  {
    id: "variantes",
    header: "Variantes",
    cell: ({ row }) => {
      return <VariantsDialog product={row.original} />;
    },
  },
  {
    header: "Estado",
    cell: ({ row: { original } }) => {
      return (
        <Badge variant={`${original.isAvailable ? "default" : "destructive"}`}>
          {original.isAvailable ? "Disponible" : "No disponible"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end mr-2">
          <DataTableRowActions row={row} />
        </div>
      );
    },
  },
];
