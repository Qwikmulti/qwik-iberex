"use client";
// src/components/shared/SearchInput.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchInput({
  defaultValue = "",
  placeholder = "Search properties, neighborhoods, articles…",
}: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const clear = () => {
    setValue("");
    router.push("/search");
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full pl-12 pr-12 py-4 bg-white border border-cream-300 rounded-2xl text-ink-900
                   placeholder:text-ink-400 text-base font-body
                   focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent
                   shadow-sm transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
