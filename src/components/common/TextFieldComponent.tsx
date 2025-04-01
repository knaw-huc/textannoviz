import {
  Input,
  Label,
  TextField,
  type TextFieldProps,
} from "react-aria-components";

type TextFieldComponentProps = {
  label?: string;
  width?: string;
  labelStyling?: string;
} & TextFieldProps;

export function TextFieldComponent({
  label,
  labelStyling,
  width,
  ...props
}: TextFieldComponentProps) {
  return (
    <TextField {...props} className="flex flex-col gap-1">
      {label && (
        <Label className={`${labelStyling ? labelStyling : ""}`}>{label}</Label>
      )}
      <Input
        className={` ${
          width ? width : "w-16"
        } border-brand1Grey-700 mr-2 rounded-md border bg-white px-2 py-1 text-sm`}
      />
    </TextField>
  );
}
