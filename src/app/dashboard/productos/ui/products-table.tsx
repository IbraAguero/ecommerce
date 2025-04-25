import { DataTable } from "@/components/data-table";
import { columns } from "./products-columns";
import { getAllProducts } from "@/actions/products-action";

async function ProductsTable() {
  const { data: products } = await getAllProducts();

  return (
    <>
      <DataTable columns={columns} data={products || []} />
    </>
  );
}
export default ProductsTable;
