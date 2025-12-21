import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { UserPlus } from "lucide-react";

type Props = {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (names: string[]) => void;
  maxItems?: number;
};

export default function MemberChipsInput({
  label = "Member Name(s)",
  placeholder = "Olivia",
  value,
  onChange,
  maxItems = 50,
}: Props) {
  const [input, setInput] = useState("");

  const normalize = (s: string) => s.trim();
  const key = (s: string) => s.toLowerCase();

  const add = (raw: string) => {
    const name = normalize(raw);
    if (!name) return;
    if (value.length >= maxItems) return;
    const exists = new Set(value.map(key));
    if (exists.has(key(name))) return;
    onChange([...value, name]);
    setInput("");
  };

  const remove = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.includes(",")) {
      const parts = text.split(",").map(normalize).filter(Boolean);
      if (parts.length) {
        const existing = new Set(value.map(key));
        const toAdd = parts.filter((p) => !existing.has(key(p)));
        if (toAdd.length) onChange([...value, ...toAdd]);
      }
      setInput("");
    } else {
      setInput(text);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-[15px] outline-none focus:border-gray-500"
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={() => add(input)}
          className="rounded-full px-5 py-2.5 text-white font-semibold bg-black disabled:opacity-50"
          disabled={!normalize(input)}
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800"
            >
              {name.toLowerCase()}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
