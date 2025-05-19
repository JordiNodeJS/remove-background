import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--background)] px-4">
      <header className="w-full max-w-md flex flex-col items-center mb-8">
        <Image
          src="/favicon.svg"
          alt="Logo"
          width={56}
          height={56}
          className="mb-2"
        />
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-1 tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-[var(--muted)] text-base text-center">
          Regístrate para comenzar a eliminar fondos de imágenes
        </p>
      </header>
      <main className="w-full max-w-md card animate-fade-in-up">
        <SignUp
          path="/sign-up"
          appearance={{
            elements: {
              card: "shadow-none bg-transparent p-0",
              formButtonPrimary: "btn-primary w-full",
              headerTitle: "text-xl font-semibold text-[var(--primary)]",
              headerSubtitle: "text-[var(--muted)]",
              socialButtonsBlockButton: "btn-secondary w-full",
              footerAction: "text-sm",
              footerActionLink:
                "underline text-[var(--primary)] hover:text-[var(--primary-hover)]",
            },
          }}
          routing="path"
          signInUrl="/"
          afterSignUpUrl="/dashboard"
        />
      </main>
      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} Remove Background. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
