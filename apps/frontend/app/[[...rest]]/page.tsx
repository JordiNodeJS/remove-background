import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[var(--background)] to-[var(--secondary)] relative px-4 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-[var(--primary)]/5 blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full bg-[var(--primary)]/10 blur-2xl"></div>
      </div>

      {/* Encabezado con logo/nombre */}
      <header className="w-full max-w-md flex flex-col items-center mb-8 relative z-10">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/80 dark:bg-[var(--secondary)]/80 backdrop-blur-md shadow-lg mb-4 p-3 border border-white/30 dark:border-[var(--border)]/50">
          <Image
            src="/favicon.svg"
            alt="Logo"
            width={56}
            height={56}
            className="drop-shadow-md"
          />
        </div>
        <h1 className="text-4xl font-bold text-[var(--primary)] mb-2 tracking-tight drop-shadow-sm">
          Remove Background
        </h1>
        <p className="text-[var(--muted)] text-lg text-center max-w-sm px-6 py-2 rounded-full bg-white/30 dark:bg-[var(--secondary)]/30 backdrop-blur-md border border-white/20 dark:border-[var(--border)]/20 shadow-sm">
          Inicia sesión para eliminar fondos de imágenes al instante
        </p>
      </header>

      {/* Card de login Clerk con estilos personalizados */}
      <main className="w-full max-w-md animate-fade-in-up relative z-10 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[var(--secondary)]/80 shadow-2xl border border-white/30 dark:border-[var(--border)]/30 p-8">
        {/* Clerk SignIn component: muestra el formulario de login */}{" "}
        <SignIn
          path="/"
          appearance={{
            elements: {
              card: "shadow-none bg-transparent p-0",
              formButtonPrimary:
                "btn-primary w-full relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]",
              headerTitle:
                "text-xl font-semibold text-[var(--primary)] drop-shadow-sm",
              headerSubtitle: "text-[var(--muted)]",
              socialButtonsBlockButton:
                "bg-white/50 dark:bg-[var(--secondary)]/50 border border-white/30 dark:border-[var(--border)]/30 shadow-sm backdrop-blur-sm hover:bg-[var(--accent)]/50 transition-all w-full rounded-xl py-3 hover:scale-[1.01] active:scale-[0.98]",
              footerAction: "text-sm",
              footerActionLink:
                "text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium",
              formFieldInput:
                "bg-white/50 dark:bg-[var(--secondary)]/50 border border-white/30 dark:border-[var(--border)]/30 backdrop-blur-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)]/30 transition-all",
              formFieldLabel: "text-[var(--foreground)]/80 font-medium mb-1",
              formFieldRow: "mb-4",
              otpCodeFieldInputs:
                "bg-white/50 dark:bg-[var(--secondary)]/50 border border-white/30 dark:border-[var(--border)]/30 backdrop-blur-sm",
              formFieldLabelRow: "mb-1",
            },
          }}
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />{" "}
      </main>

      {/* Footer opcional */}
      <footer className="mt-10 text-center text-xs relative z-10">
        <div className="px-4 py-2 rounded-full bg-white/40 dark:bg-[var(--secondary)]/40 backdrop-blur-md border border-white/20 dark:border-[var(--border)]/20 shadow-sm">
          &copy; {new Date().getFullYear()} Remove Background. Todos los
          derechos reservados.
        </div>
      </footer>

      {/* Elementos decorativos inferiores */}
      <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent z-10"></div>
    </div>
  );
}
