"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";

export default function SearchBar({
  onSearch,
  isLoading
}: {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="relative rounded-lg bg-gray-100 dark:bg-gray-800 w-48">
          <Input
            type="text"
            disabled={isLoading ? isLoading : false}
            placeholder="Cari..."
            className="rounded-lg appearance-none w-48 pl-8 text-xs"
            onChange={(e) => { handleChange(e) }}
            value={query}
          />
          {/* <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-600" /> */}
        </div>
      </div>
    </div>
  );
}
