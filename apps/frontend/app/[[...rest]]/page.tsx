import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--background)] px-4">
      {/* Encabezado con logo/nombre */}
      <header className="w-full max-w-md flex flex-col items-center mb-8">
        <Image
          src="/favicon.svg"
          alt="Logo"
          width={56}
          height={56}
          className="mb-2"
        />
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-1 tracking-tight">
          Remove Background
        </h1>
        <p className="text-[var(--muted)] text-base text-center">
          Inicia sesión para eliminar fondos de imágenes de forma segura y
          rápida
        </p>
      </header>

      {/* Card de login Clerk con estilos personalizados */}
      <main className="w-full max-w-md card animate-fade-in-up dark:bg-[#1a3323] dark:border-[#14532d]">
        {/* Clerk SignIn component: muestra el formulario de login */}
        <SignIn
          path="/"
          appearance={{
            elements: {
              card: "shadow-none bg-transparent p-0 dark:bg-[#1a3323]",
              formButtonPrimary: "btn-primary w-full",
              headerTitle:
                "text-xl font-semibold text-[var(--primary)] dark:text-[var(--primary)]",
              headerSubtitle: "text-[var(--muted)] dark:text-[var(--muted)]",
              socialButtonsBlockButton: "btn-secondary w-full",
              footerAction: "text-sm",
              footerActionLink:
                "underline text-[var(--primary)] hover:text-[var(--primary-hover)]",
              formFieldInput: "dark:bg-[#0d1b12] dark:text-[var(--foreground)]",
              formFieldLabel: "dark:text-[var(--foreground)]",
            },
          }}
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </main>

      {/* Footer opcional */}
      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} Remove Background. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
