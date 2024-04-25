import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Group,
  Input,
  Label,
  SearchField,
  type SearchFieldProps,
} from "react-aria-components";

interface SearchFieldComponentProps extends SearchFieldProps {
  label?: string;
  placeholder?: string;
}

export function SearchFieldComponent({
  label,
  placeholder,
  ...props
}: SearchFieldComponentProps) {
  return (
    <SearchField {...props} className="group flex min-w-[40px] flex-col gap-1">
      {label && <Label className="font-semibold">{label}</Label>}
      <Group className="group flex h-10 items-center overflow-hidden rounded-md border focus-within:border-black">
        <MagnifyingGlassIcon
          aria-hidden
          className="ml-2 h-4 w-4 text-gray-500"
        />
        <Input
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-white px-2 py-1.5 text-gray-800 outline outline-0 [&::-webkit-search-cancel-button]:hidden"
        />
        <Button className="text-brand2-600 pressed:bg-brand2-600/10 hover:bg-brand2-600/[5%] mr-1 flex w-6 items-center justify-center rounded-lg border-0 p-1 transition group-empty:invisible">
          <XMarkIcon aria-hidden className="h-4 w-4" />
        </Button>
      </Group>
    </SearchField>
  );
}
