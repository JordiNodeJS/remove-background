import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ImageProcessor from "@/components/ImageProcessor";

export default async function DashboardPage() {
  // Proteger la ruta: si no hay usuario, redirigir al login
  const user = await currentUser();
  if (!user) redirect("/");
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 bg-[var(--background)] relative px-4 overflow-hidden transition-colors duration-500">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full bg-pink-600/20 dark:bg-pink-500/10 blur-3xl transition-colors duration-700"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-pink-500/15 dark:bg-pink-600/10 blur-3xl transition-colors duration-700"></div>
        <div className="absolute top-[30%] right-[15%] w-64 h-64 rounded-full bg-pink-400/15 dark:bg-pink-700/15 blur-2xl transition-colors duration-700"></div>
      </div>

      <header className="w-full max-w-2xl flex flex-col items-center mb-8 relative z-10">
        {" "}
        <div className="absolute top-0 right-4 mt-4">
          <div className="w-14 h-14 flex items-center justify-center p-1.5 rounded-full bg-white/70 dark:bg-[var(--secondary)]/70 backdrop-blur-md shadow-md border border-white/30 dark:border-pink-900/30 transition-all duration-300 hover:scale-105">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard:
                    "bg-white/80 dark:bg-[var(--secondary)]/80 backdrop-blur-md border border-white/30 dark:border-pink-900/30 shadow-xl",
                },
              }}
            />
          </div>
        </div>{" "}
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4 mt-4 tracking-tight drop-shadow-sm transition-colors duration-300">
          Bienvenido a tu{" "}
          <span className="text-pink-500 dark:text-pink-400 transition-colors duration-300">
            Dashboard
          </span>
        </h1>
        <div className="relative w-full max-w-lg flex items-center mb-6 transition-all duration-300">
          <div className="absolute -left-2 top-0 w-full h-full bg-gradient-to-r from-pink-500/10 via-pink-400/5 to-transparent rounded-lg blur-xl -z-10"></div>
          <div className="h-10 w-2 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full mr-4 shadow-lg shadow-pink-500/20"></div>
          <span className="text-lg text-[var(--foreground)]/80 font-medium italic transition-colors duration-300">
            Ya puedes comenzar a eliminar fondos de imágenes
          </span>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center relative z-10">
        <ImageProcessor />
      </main>

      {/* Elementos decorativos inferiores */}
      <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-r from-transparent via-pink-500/30 dark:via-pink-500/20 to-transparent z-10 transition-colors duration-500"></div>
    </div>
  );
}
