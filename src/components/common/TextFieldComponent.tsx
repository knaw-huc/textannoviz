import {
  Input,
  Label,
  TextField,
  type TextFieldProps,
} from "react-aria-components";

interface TextFieldComponentProps extends TextFieldProps {
  label?: string;
}

export function TextFieldComponent({
  label,
  ...props
}: TextFieldComponentProps) {
  return (
    <TextField {...props}>
      {label && <Label>{label}</Label>}
      <Input className="border-brand1Grey-700 mr-2 w-16 rounded border bg-white px-2 py-1 text-sm" />
    </TextField>
  );
}
