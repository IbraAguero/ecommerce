import clsx from "clsx";
import { Button } from "../ui/button";

interface Props {
  selectedColor?: string | null;
  availableColor: { name: string; value: string }[];
  disabledColors: { name: string; value: string }[];

  onColorChanged: (color: string) => void;
}

function ColorSelector({
  availableColor,
  selectedColor,
  disabledColors,
  onColorChanged,
}: Props) {
  return (
    <div className="space-y-2">
      <h4 className="">
        Color: <span className="font-medium">{selectedColor}</span>
      </h4>
      <div className="flex gap-2">
        {availableColor.map((color) => {
          const isDisabled = !disabledColors.some((c) => c.name === color.name);

          return (
            <Button
              key={color.name}
              size="icon"
              variant="secondary"
              //disabled={isDisabled}
              className={clsx(
                "border border-zinc-300 hover:border-zinc-400 transition-colors",
                {
                  "border-black": color.name === selectedColor,
                  "cursor-not-allowed hover:border-zinc-300": isDisabled,
                }
              )}
              onClick={() => !isDisabled && onColorChanged(color.name)}
            >
              <div
                className={`w-7 h-7 border border-zinc-300`}
                style={{ backgroundColor: color.value }}
              ></div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
export default ColorSelector;
