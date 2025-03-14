"use client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface Props {
  images: string[];
}

function GridImages({ images }: Props) {
  const [activeImage, setActiveImage] = useState(images[0]);

  const handleImageClick = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className="flex flex-col w-full items-center gap-y-3 md:gap-y-5">
      <div className="relative w-full aspect-[3/4] lg:aspect-[16/9] md:h-[500px] lg:h-[600px]">
        <Image
          className="rounded-xl object-contain"
          src={activeImage}
          alt={"image product"}
          fill
        />
      </div>
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        className="w-[300px]"
      >
        <CarouselContent className="-ml-5">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-5 basis-1/3 lg:basis-3/8">
              <div
                key={index}
                onClick={() => handleImageClick(image)}
                className={clsx(
                  "w-[90px] h-[120px] relative rounded-md cursor-pointer hover:opacity-100 transition",
                  { "opacity-85": activeImage !== image }
                )}
              >
                <Image
                  src={image}
                  alt="image"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex gap-4"></div>
    </div>
  );
}
export default GridImages;
