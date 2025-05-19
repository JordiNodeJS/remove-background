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
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </main>

      {/* Footer opcional */}
      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} Remove Background.
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="https://github.com/JordiNodeJS/remove-background"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--primary)] underline hover:text-[var(--primary-hover)] text-base font-semibold"
          >
            <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="inline-block">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Repositorio en GitHub
          </a>
          <span className="text-sm mt-1">
            ⭐ Si te gusta el proyecto, <span className="font-bold text-[var(--primary)]">¡danos una estrella en GitHub!</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
