"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // We use useState to ensure the QueryClient is only initialized once per session, 
  // preventing data loss during React re-renders.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Cache data for 1 minute before refetching
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}