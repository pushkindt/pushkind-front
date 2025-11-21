/**
 * @file SearchBar.tsx exposes a reusable product search input.
 */
import React from "react";

/** Props consumed by the `SearchBar` component. */
interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (nextValue: string) => void;
}

/**
 * Search input styled for the storefront header that emits query updates while
 * keeping controls accessible.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = "Поиск товаров",
  onChange,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="product-search" className="sr-only">
        Поиск товаров
      </label>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
        <svg
          className="w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 focus:outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;
