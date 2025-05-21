import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--background)] px-4">
      <header className="w-full max-w-md flex flex-col items-center mb-8">
        <Image
          src="/favicon.svg"
          alt="Logo"
          width={56}
          height={56}
          className="mb-2 mt-2"
        />
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-1 tracking-tight">
          Inicia sesión
        </h1>
        <p className="text-[var(--muted)] text-base text-center">
          Accede a tu cuenta para eliminar fondos de imágenes
        </p>
      </header>
      <main className="w-full max-w-md card animate-fade-in-up">
        <SignIn path="/sign-in" routing="path" afterSignInUrl="/dashboard" />
      </main>
      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} Remove Background. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
