import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label?: string;
  error?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Shown when no option matches `value` */
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  /** Extra classes on the trigger (e.g. pill colors in tables) */
  triggerClassName?: string;
  /** `sm` for compact table controls */
  size?: "sm" | "md";
  /** Open menu above trigger (helps inside scroll tables) */
  dropdownPosition?: "below" | "above";
  id?: string;
  name?: string;
};

export default function Select({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled,
  required,
  className = "",
  triggerClassName = "",
  size = "md",
  dropdownPosition = "below",
  id: idProp,
  name,
}: SelectProps) {
  const autoId = useId();
  const id = idProp ?? `select-${autoId}`;
  const listId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [highlight, setHighlight] = useState(0);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? placeholder;

  useEffect(() => {
    if (!open) return;
    const i = options.findIndex((o) => o.value === value);
    setHighlight(i >= 0 ? i : 0);
    const t = window.requestAnimationFrame(() => listRef.current?.focus());
    return () => window.cancelAnimationFrame(t);
  }, [open, options, value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) pick(opt.value);
    }
  };

  const triggerSize =
    size === "sm"
      ? "h-8 min-h-0 px-2.5 py-0 text-xs font-medium"
      : "box-border h-11 min-h-0 px-4 py-0 text-sm font-medium";

  const menuPosition =
    dropdownPosition === "above"
      ? "bottom-full mb-1 origin-bottom"
      : "top-full mt-1 origin-top";

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white text-left text-slate-800 transition",
          "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] disabled:cursor-not-allowed disabled:opacity-50",
          triggerSize,
          triggerClassName,
        ].join(" ")}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={0}
          onKeyDown={onListKeyDown}
          className={[
            "absolute left-0 z-[80] max-h-60 min-w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#FF7A00]",
            menuPosition,
          ].join(" ")}
        >
          {options.map((opt, index) => {
            const active = index === highlight;
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value === "" ? "__empty__" : opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(opt.value)}
                className={[
                  "flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm text-gray-900",
                  active ? "bg-[#FF7A00]/12" : "hover:bg-gray-50",
                  isSelected ? "font-semibold" : "",
                ].join(" ")}
              >
                {isSelected ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                ) : (
                  <span className="inline-block w-4 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1">{opt.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
