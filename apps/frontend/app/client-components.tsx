"use client";

import dynamic from "next/dynamic";

// Importación dinámica de componentes cliente
const AuthProviderClient = dynamic(() => import("@/components/AuthProvider"), {
  ssr: false,
});

const UserHistoryManagerClient = dynamic(
  () => import("@/components/UserHistoryManager"),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderClient>
      <UserHistoryManagerClient />
      {children}
    </AuthProviderClient>
  );
}
