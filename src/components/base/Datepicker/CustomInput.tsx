import { cn } from "@heroui/react";
import { forwardRef } from "react";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  className?: string;
  placeholder?: string;
  titleEnd?: string;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick, className, placeholder, titleEnd }, ref) => (
    <button className={cn(className, titleEnd && "flex flex-row items-center justify-between")} onClick={onClick} ref={ref}>
      {value && value.length > 0 ? value : <p className="text-gray-500 font-normal">{placeholder}</p>}
      {titleEnd && <p className="text-gray-500 font-normal">{titleEnd}</p>}
    </button>
  )
);
CustomInput.displayName = "CustomInput";

export default CustomInput;