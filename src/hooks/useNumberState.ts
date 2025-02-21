import { useState } from "react";

export function useNumberState(
  initialValue?: number | null | undefined
): [number | null | undefined, (value: number | string) => void, string] {
  const [value, setInternalValue] = useState<number | null | undefined>(
    initialValue
  );
  const [stringValue, setStringValue] = useState<string>(
    initialValue ? initialValue.toString() : ""
  );

  const setValue = (newValue: number | string) => {
    if (typeof newValue === "string") {
      // Remove commas but keep decimal points, then convert to number
      const cleanedValue = newValue.replace(/,/g, "");
      const numberValue = Number(cleanedValue);
      
      if (!isNaN(numberValue)) {
        setInternalValue(numberValue);
        // If input has decimal point, preserve it in string representation
        if (cleanedValue.includes(".")) {
          const [whole, decimal] = cleanedValue.split(".");
          const formattedWhole = Number(whole).toLocaleString();
          setStringValue(`${formattedWhole}.${decimal}`);
        } else {
          setStringValue(numberValue.toLocaleString());
        }
      }
    } else {
      setInternalValue(newValue);
      // Handle decimal points for number inputs too
      const stringified = newValue.toString();
      if (stringified.includes(".")) {
        const [whole, decimal] = stringified.split(".");
        const formattedWhole = Number(whole).toLocaleString();
        setStringValue(`${formattedWhole}.${decimal}`);
      } else {
        setStringValue(newValue.toLocaleString());
      }
    }
  };

  return [value, setValue, stringValue];
}
