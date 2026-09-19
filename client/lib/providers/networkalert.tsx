"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function NetworkAlert() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Internet connection restored", {
        icon: <Wifi className="size-5 text-emerald-500" />,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Optional: Dispatch a custom event to pause autosaves globally
      window.dispatchEvent(new Event("network-offline"));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="fixed top-6 left-1/2 w-fit -translate-x-1/2 z-100 flex items-center gap-1.5 md:gap-3 bg-red-600 dark:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow-2xl border border-red-500 text-xs md:text-sm font-semibold tracking-wide"
        >
          <WifiOff className="w-4 h-4 animate-pulse" />
          No Internet Connection
        </motion.div>
      )}
    </AnimatePresence>
  );
}
