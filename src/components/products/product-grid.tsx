import { ProductWithVariants } from "@/interfaces/product-interface";
import ProductItem from "./product-item";

function ProductGrid({ products }: { products: ProductWithVariants[] }) {
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {products.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <h3 className="text-center font-semibold my-20">
          No se encotraron productos :(
        </h3>
      )}
    </>
  );
}
export default ProductGrid;
