import { Button } from "@/components/ui/button";
import { ProductWithVariants } from "@/interfaces/product-interface";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: ProductWithVariants;
}

function ProductItem({ product }: Props) {
  const price = Math.min(...product.variants.map((variant) => variant.price));

  return (
    <div key={product.slug} className="flex justify-center">
      <div className="group">
        <div className="relative overflow-hidden">
          <Link href={`/producto/${product.slug}`}>
            <Image
              src={product.images[0] || ""}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-lg object-cover h-[350px]"
            />
          </Link>
          <Button
            variant="secondary"
            className="absolute top-0 right-0 m-3 h-10 w-10 shadow-lg rounded-full grid place-content-center"
          >
            <Heart size={18} />
          </Button>
          <div className="absolute bottom-0 flex justify-center items-center gap-2 py-3 text-sm font-medium bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full cursor-pointer transition-all duration-300 translate-y-[100%] group-hover:translate-y-0">
            <ShoppingCart size={17} />
            <span>Agregrar al carrito</span>
          </div>
        </div>
        <Link href={`/producto/${product.slug}`}>
          <h4 className="text-lg text-zinc-700 tracking-wide mt-2">
            {product.name}
          </h4>
        </Link>
        <h4 className="font-medium">
          {price.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </h4>
      </div>
    </div>
  );
}
export default ProductItem;
