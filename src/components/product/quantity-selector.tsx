"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

interface Props {
  quantity: number;

  onQuantityChanged: (value: number) => void;
}

function QuantitySelector({ quantity, onQuantityChanged }: Props) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;

    onQuantityChanged(quantity + value);
  };

  const onInputChange = (value: string) => {
    if (value === "") {
      setInputValue(value);
      return;
    }

    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue < 1) return;

    setInputValue(value);
    onQuantityChanged(parsedValue);
  };

  return (
    <div className="space-y-2">
      <h4 className="">Cantidad</h4>
      <div className="flex items-center border border-black rounded-lg w-fit">
        <Button onClick={() => onValueChanged(-1)} variant="ghost">
          <IoMdRemove />
        </Button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-10 text-center appearance-none bg-transparent outline-none"
        />
        <Button onClick={() => onValueChanged(+1)} variant="ghost">
          <IoMdAdd />
        </Button>
      </div>
    </div>
  );
}
export default QuantitySelector;
