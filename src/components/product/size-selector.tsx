import clsx from "clsx";
import { Button } from "../ui/button";

interface Props {
  selectedSize?: string;
  availableSizes: string[];

  onSizeChanged: (size: string) => void;
}

function SizeSelector({ availableSizes, selectedSize, onSizeChanged }: Props) {
  console.log({ availableSizes, selectedSize });

  return (
    <div className="space-y-2">
      <h4>
        Talle <span className="font-medium">{selectedSize}</span>
      </h4>
      <div className="flex gap-2">
        {availableSizes.map((size) => (
          <Button
            key={size}
            size="icon"
            variant="secondary"
            className={clsx(
              "border border-zinc-300 hover:border-zinc-400 transition-colors",
              {
                "border-black hover:border-black": size === selectedSize,
              }
            )}
            onClick={() => onSizeChanged(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
export default SizeSelector;
