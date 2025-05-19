import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ImageProcessor from "@/components/ImageProcessor";

export default async function DashboardPage() {
  // Proteger la ruta: si no hay usuario, redirigir al login
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 bg-gradient-to-br from-[var(--background)] to-[var(--secondary)] relative px-4 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full bg-[var(--primary)]/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-[var(--primary)]/5 blur-3xl"></div>
        <div className="absolute top-[30%] right-[15%] w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-2xl"></div>
      </div>

      <header className="w-full max-w-2xl flex flex-col items-center mb-8 relative z-10">
        <div className="absolute top-0 right-4 mt-4">
          <div className="p-1.5 rounded-full bg-white/70 dark:bg-[var(--secondary)]/70 backdrop-blur-md shadow-md border border-white/30 dark:border-[var(--border)]/30">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard:
                    "bg-white/80 dark:bg-[var(--secondary)]/80 backdrop-blur-md border border-white/30 dark:border-[var(--border)]/30 shadow-xl",
                },
              }}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[var(--primary)] mb-3 mt-4 tracking-tight drop-shadow-sm">
          Bienvenido a tu Dashboard
        </h1>
        <div className="px-6 py-2 rounded-full bg-white/50 dark:bg-[var(--secondary)]/50 backdrop-blur-md border border-white/30 dark:border-[var(--border)]/30 shadow-sm">
          <p className="text-[var(--muted)] text-lg text-center font-medium">
            Ya puedes comenzar a eliminar fondos de imágenes
          </p>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center relative z-10">
        <ImageProcessor />
      </main>

      {/* Elementos decorativos inferiores */}
      <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent z-10"></div>
    </div>
  );
}
