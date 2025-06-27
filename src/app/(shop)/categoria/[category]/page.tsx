import {
  getFilterPrice,
  getProductFilters,
  getProducts,
} from "@/actions/products-action";
import ProductFilters from "@/components/products/product-filters";
import ProductGrid from "@/components/products/product-grid";
import Title from "@/components/title";
import { toArray } from "@/lib/utils";

interface Props {
  searchParams: {
    color: string[];
    size: string[];
    minPrice: string;
    maxPrice: string;
  };
  params: {
    category: string;
  };
}

async function Page({ params, searchParams }: Props) {
  const { category } = params;
  const { maxPrice, minPrice, color, size } = await searchParams;

  const colorsArray = toArray(color);
  const sizesArray = toArray(size);

  const products = await getProducts({
    category,
    color: colorsArray,
    size: sizesArray,
    maxPrice: Number(maxPrice),
    minPrice: Number(minPrice),
  });

  const filtersOptions = await getProductFilters({
    category,
    colorSelected: colorsArray,
    sizesSelected: sizesArray,
    maxPrice: Number(maxPrice),
    minPrice: Number(minPrice),
  });

  const priceRange = await getFilterPrice({
    category,
    colorSelected: colorsArray,
    sizesSelected: sizesArray,
  });

  return (
    <div>
      <Title title={category} />

      <ProductFilters filterOptions={{ ...filtersOptions, priceRange }} />

      <ProductGrid products={products} />
    </div>
  );
}
export default Page;
