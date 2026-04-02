import { useMemo, useRef } from "react";

export interface SelectComponentAltOption {
  name: string;
  value: string | number;
}

function resolveSelectValue(
  value: string | number | null | undefined,
  options: SelectComponentAltOption[],
): string | number {
  if (options.length === 0) {
    return "";
  }
  const match = options.find(
    (o) =>
      o.value === value || (value != null && String(o.value) === String(value)),
  );
  return match ? match.value : options[0].value;
}

export interface SelectComponentAltProps {
  label: string;
  helpLabel?: string;
  options: SelectComponentAltOption[];
  value: string | number | null | undefined;
  onChange: (value: string | number) => void;
  id?: string;
  className?: string;
  required?: boolean;
  requiredAnnouncement?: string;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export function SelectComponentAlt({
  label,
  helpLabel,
  options,
  value,
  onChange,
  id: idProp,
  className,
  required = false,
  requiredAnnouncement,
  invalid = false,
  errorMessage,
  disabled = false,
}: SelectComponentAltProps) {
  const fallbackId = useRef(
    `select-${Math.random().toString(36).slice(2, 11)}`,
  );
  const selectId = idProp ?? fallbackId.current;
  const labelId = `${selectId}-label`;
  const helpId = `${selectId}-help`;
  const errorId = `${selectId}-error`;

  const resolvedValue = useMemo(
    () => resolveSelectValue(value, options),
    [value, options],
  );

  const describedBy = useMemo(() => {
    const ids: string[] = [];
    if (helpLabel) ids.push(helpId);
    if (errorMessage) ids.push(errorId);
    return ids.length > 0 ? ids.join(" ") : undefined;
  }, [helpLabel, helpId, errorMessage, errorId]);

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={className ?? "flex flex-col gap-1"}
    >
      <h2 id={labelId} className="text-base font-semibold text-neutral-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-neutral-700">
            {" "}
            *
          </span>
        ) : null}
        {required && requiredAnnouncement ? (
          <span className="sr-only">{`, ${requiredAnnouncement}`}</span>
        ) : null}
      </h2>
      {helpLabel ? (
        <p id={helpId} className="text-sm text-neutral-700">
          {helpLabel}
        </p>
      ) : null}
      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}
      <select
        id={selectId}
        className=" min-h-10 w-full max-w-[150px] cursor-pointer rounded border bg-white px-2 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        value={String(resolvedValue)}
        required={required}
        aria-labelledby={labelId}
        aria-required={required || undefined}
        aria-invalid={invalid || Boolean(errorMessage) || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          const matched = options.find((o) => String(o.value) === v);
          onChange(matched ? matched.value : v);
        }}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
