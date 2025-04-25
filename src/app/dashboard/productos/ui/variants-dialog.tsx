"use client";

import { addVariants } from "@/actions/products-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductWithVariants } from "@/interfaces/product-interface";
import { parsedPrice } from "@/lib/utils";
import { ProductVariant } from "@prisma/client";
import clsx from "clsx";
import { ChevronDown, Edit, Plus, Save, Trash, X } from "lucide-react";
import { useState } from "react";

interface Props {
  product: ProductWithVariants;
}

function VariantsDialog({ product }: Props) {
  const [variants, setVariants] = useState(product.variants);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    size: "",
    color: "",
    colorHex: "",
    stock: 0,
    price: 0,
  });

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant.id);
    setEditForm({
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      stock: variant.stock,
      price: variant.price,
    });
  };

  const handleAddVariant = () => {
    const newId = `var_${Date.now()}`;

    setVariants([
      {
        id: newId,
        size: "",
        color: "",
        colorHex: "#000000",
        stock: 0,
        price: 0,
      },
      ...variants,
    ]);

    setEditingVariant(newId);
    setEditForm({
      size: "",
      color: "",
      colorHex: "#000000",
      stock: 0,
      price: 0,
    });
  };

  const handleSaveVariant = (variantId: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              ...editForm,
            }
          : v
      )
    );
    setEditingVariant(null);
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const saveAllVariants = async () => {
    await addVariants(product.id, variants);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Variantes / {product.variants.length} <ChevronDown />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Administrar variantes</DialogTitle>
          <DialogDescription>
            {product.name} - {variants.length} variante
            {variants.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Variantes</h3>
            <Button size="sm" onClick={handleAddVariant} variant="secondary">
              <Plus />
              Agregar variante
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Talle</TableHead>
                <TableHead className="text-center">Color</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No hay variantes registradas.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((variant) => (
                  <TableRow key={variant.id}>
                    {editingVariant === variant.id ? (
                      <>
                        <TableCell>
                          <Input
                            className="h-8"
                            value={editForm.size}
                            onChange={(e) =>
                              setEditForm({ ...editForm, size: e.target.value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded border"
                              style={{ backgroundColor: editForm.colorHex }}
                            />
                            <div className="flex flex-col gap-2">
                              <Input
                                className="h-8"
                                value={editForm.color}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    color: e.target.value,
                                  })
                                }
                              />
                              <Input
                                className="h-8"
                                value={editForm.colorHex}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    colorHex: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8 w-20"
                            type="number"
                            min={0}
                            value={editForm.stock}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                stock: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              className="h-8 w-24 pl-6"
                              type="number"
                              min={0}
                              value={editForm.price}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  price: Number.parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleSaveVariant(variant.id)}
                            >
                              <Save />
                              <span className="sr-only">Guardar</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancelar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-center">
                          {variant.size}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="h-6 w-6 rounded border"
                              style={{ backgroundColor: variant.colorHex }}
                            />
                            <span>{variant.color}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              variant.stock === 0
                                ? "destructive"
                                : variant.stock < 10
                                ? "outline"
                                : "default"
                            }
                            className={clsx(
                              "bg-green-100 text-green-800 hover:bg-green-100",
                              {
                                "bg-red-100 text-red-800 hover:bg-red-100":
                                  variant.stock === 0,
                                "bg-yellow-100 text-yellow-800 hover:bg-yellow-100":
                                  variant.stock < 10,
                              }
                            )}
                          >
                            {variant.stock <= 0
                              ? "Fuera de stock"
                              : variant.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {parsedPrice(variant.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleEditVariant(variant)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteVariant(variant.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={saveAllVariants}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default VariantsDialog;
