"use client";

import dynamic from "next/dynamic";

// Importamos de forma dinámica para evitar problemas con server/client components
const AppInit = dynamic(() => import("@/components/AppInit"), { ssr: false });

export default function InitWrapper() {
  return <AppInit />;
}
