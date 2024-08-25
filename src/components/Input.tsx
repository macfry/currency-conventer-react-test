import { Dispatch, SetStateAction } from "react";

interface InputProps {
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const Input = ({ value, setValue, disabled, readOnly }: InputProps) => {
  return <input type="number" value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled ?? false} readOnly={readOnly ?? false} />
};

export default Input;
