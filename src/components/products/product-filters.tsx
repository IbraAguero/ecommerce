"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { IoIosArrowDown } from "react-icons/io";
import { Slider } from "../ui/slider";
import { useEffect, useState } from "react";
import { parsedPrice } from "@/lib/utils";

interface Props {
  filterOptions: {
    sizes: { size: string; count: number }[];
    colors: { colorName: string; colorHex: string; count: number }[];
    priceRange: { minPrice: number; maxPrice: number };
  };
}

function ProductFilters({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedColors = searchParams.getAll("color");
  const selectedSizes = searchParams.getAll("size");

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")),
    Number(searchParams.get("maxPrice")),
  ]);

  useEffect(() => {
    if (!filterOptions.priceRange) return;

    const { minPrice, maxPrice } = filterOptions.priceRange;

    // Obtenemos los valores actuales en los parámetros de búsqueda
    const currentMin = Number(searchParams.get("minPrice")) || minPrice;
    const currentMax = Number(searchParams.get("maxPrice")) || maxPrice;

    // Solo actualizamos el estado si los valores han cambiado
    if (priceRange[0] !== currentMin || priceRange[1] !== currentMax) {
      setPriceRange([currentMin, currentMax]);
    }
  }, [filterOptions.priceRange, searchParams]);

  const handlePriceChange = ([min, max]: number[]) => {
    setPriceRange([min, max]);
    //setIsUserInteracted(true);
  };

  const handleColorChange = (color: string) => {
    updateFilters({
      color: selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color],
    });
  };

  const handleSizeChange = (size: string) => {
    updateFilters({
      size: selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size],
    });
  };

  const applyFilterPrice = () => {
    updateFilters({
      minPrice: String(priceRange[0]),
      maxPrice: String(priceRange[1]),
    });
  };

  const resetFilterPrice = () => {
    setPriceRange([
      filterOptions.priceRange.minPrice,
      filterOptions.priceRange.maxPrice,
    ]);
    updateFilters({
      minPrice: "",
      maxPrice: "",
    });
  };

  const updateFilters = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-between my-3">
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4">
        <div className="flex gap-2 items-center col-span-2">
          <h3 className="font-medium">FILTRAR:</h3>
          {/* PRECIO */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link">
                Precio
                <IoIosArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-zinc-400 min-w-[450px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-300 pb-2">
                  <span className="text-sm">
                    {priceRange[0] && parsedPrice(priceRange[0])} -{" "}
                    {priceRange[1] && parsedPrice(priceRange[1])}
                  </span>
                  <div>
                    <Button size="sm" variant="link" onClick={resetFilterPrice}>
                      Restablecer
                    </Button>
                    <Button size="sm" onClick={applyFilterPrice}>
                      Aplicar
                    </Button>
                  </div>
                </div>
                <Slider
                  step={100}
                  className="w-full"
                  onValueChange={([min, max]) => handlePriceChange([min, max])}
                  value={priceRange}
                  min={filterOptions.priceRange.minPrice}
                  max={filterOptions.priceRange.maxPrice}
                />
              </div>
            </PopoverContent>
          </Popover>
          {/* TALLES */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link">
                Talle
                <IoIosArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-zinc-400">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-300 pb-2">
                  <span className="text-sm">
                    {selectedSizes.length} Seleccionados
                  </span>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => updateFilters({ size: [] })}
                  >
                    Restablecer
                  </Button>
                </div>
                <div className="space-y-2">
                  {filterOptions.sizes.map((size) => (
                    <div
                      key={size.size}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`size-${size.size}`}
                        checked={selectedSizes.includes(size.size)}
                        onCheckedChange={() => handleSizeChange(size.size)}
                      />
                      <Label
                        htmlFor={`size-${size.size}`}
                        className="text-sm text-zinc-800 cursor-pointer hover:underline"
                      >
                        {size.size} ({size.count})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* COLORES */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link">
                Color
                <IoIosArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-zinc-400">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-300 pb-2">
                  <span className="text-sm">
                    {selectedColors.length} Seleccionados
                  </span>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => updateFilters({ color: [] })}
                  >
                    Restablecer
                  </Button>
                </div>
                {filterOptions.colors.map((color) => (
                  <div
                    key={color.colorName}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`color-${color.colorName}`}
                      checked={selectedColors.includes(color.colorName)}
                      onCheckedChange={() => handleColorChange(color.colorName)}
                    />
                    <Label
                      htmlFor={`color-${color.colorName}`}
                      className="flex items-center text-sm text-zinc-800 cursor-pointer hover:underline"
                    >
                      {color.colorHex && (
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-muted-foreground"
                          style={{ backgroundColor: color.colorHex }}
                        ></div>
                      )}
                      <span>
                        {color.colorName} ({color.count})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
export default ProductFilters;
