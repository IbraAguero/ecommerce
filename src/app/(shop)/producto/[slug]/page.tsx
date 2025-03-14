import { getProductBySlug } from "@/actions/products-action";
import { parsedPrice } from "@/lib/utils";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import AddToCart from "./ui/add-to-cart";
import GridImages from "@/components/product/grid-images";
import DescripcionInfo from "@/components/product/description-info";
import { FaTruckFast } from "react-icons/fa6";

interface Props {
  params: { slug: string };
}

async function Page({ params }: Props) {
  const { slug } = params;

  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    return <h3>Producto no encontrdo</h3>;
  }

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <GridImages images={product.images} />

      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">{product.name}</h1>
        <h2 className="text-2xl tracking-tighter">{parsedPrice(20000)}</h2>
        <div className="space-y-2">
          <h3 className="text-zinc-700 text-sm">
            3 cuotas sin interés de <b>$18.750,00</b>
          </h3>
          <div className="flex gap-2 text-2xl text-muted-foreground">
            <FaCcVisa />
            <FaCcMastercard />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <FaTruckFast className="text-blue-500 text-2xl" />
          <span className="text-sm">
            <b className="text-blue-500">Envío gratis</b> superando los
            $70.000,00
          </span>
        </div>
        <div className="space-y-2 mt-5">
          <AddToCart product={product} />
        </div>

        {/* AGREGAR DESCRIPCION Y DEMAS */}
        <DescripcionInfo />
      </div>
    </section>
  );
}
export default Page;
