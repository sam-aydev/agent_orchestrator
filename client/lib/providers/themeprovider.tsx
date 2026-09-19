"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  const isPublicPage = !pathname?.startsWith("/app");
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={isPublicPage ? "light" : undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
