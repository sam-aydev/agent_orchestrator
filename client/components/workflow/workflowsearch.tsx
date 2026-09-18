"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function WorkflowSearch({
  initialSearch = "",
}: {
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isNavigating, setIsNavigating] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    const currentSearch = searchParamsRef.current.get("search") || "";

    if (debouncedSearch !== currentSearch) {
      setIsNavigating(true);
      const params = new URLSearchParams(searchParamsRef.current.toString());

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router]); 

  useEffect(() => {
    if (!searchParams.has("search") && searchTerm !== "") {
      setSearchTerm("");
    }
  }, [searchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch === debouncedSearch) {
      setIsNavigating(false);
    }
  }, [searchParams, debouncedSearch]);

  return (
    <div className="w-full mb-8">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isNavigating ? (
            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
