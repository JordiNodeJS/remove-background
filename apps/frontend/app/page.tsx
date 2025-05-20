"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Adding SVG icon for Twitch
const TwitchIcon = () => (
  <svg
    className="w-4 h-4 inline-block mr-1"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <main className="landing-bg min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header con login */}
      <header className="w-full max-w-4xl flex justify-end items-center mb-4">
        {!isSignedIn ? (
          <Link href="/sign-in">
            {" "}
            {/* Use Link component */}
            <span className="btn-primary px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform text-base">
              Iniciar sesión
            </span>
          </Link>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </header>
      <section className="relative w-full max-w-4xl bg-[var(--secondary)] dark:bg-[var(--secondary)]/90 rounded-2xl shadow-xl flex flex-col md:flex-row items-center p-8 gap-8 transition-colors duration-300">
        <div className="flex-1 flex flex-col items-start justify-center z-10">
          <a
            href="https://www.twitch.tv/midudev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--accent)] text-pink-700 dark:text-pink-500 font-semibold px-4 py-1 rounded-full mb-4 text-sm shadow-sm transition-colors duration-300 hover:scale-105"
          >
            <TwitchIcon /> ¡Hackatón Clerk! - 2025 🎉
          </a>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 leading-tight transition-colors duration-300">
            Elimina el fondo de tus imágenes{" "}
            <span className="text-pink-600 dark:text-pink-500">
              en segundos
            </span>
          </h1>
          <p className="text-lg text-[var(--foreground)]/80 mb-6 max-w-md transition-colors duration-300">
            Sube tu foto y obtén resultados profesionales al instante. Sin
            registros, sin complicaciones. ¡Haz que tus imágenes destaquen!
          </p>{" "}
          <div className="flex gap-4 mb-6 items-center">
            {!isSignedIn ? (
              <Link href="/sign-in">
                {" "}
                {/* Use Link component */}
                <span className="btn-primary text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Probar gratis
                </span>
              </Link>
            ) : (
              <button
                className="btn-primary text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Probar gratis
              </button>
            )}
            <a
              href="#como-funciona"
              className="btn-secondary text-lg px-6 py-3 rounded-lg border border-pink-300 dark:border-pink-900 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              ¿Cómo funciona?
            </a>
          </div>
          <ul className="text-[var(--foreground)]/70 text-sm space-y-1 mb-2">
            <li className="flex items-center">
              <span className="text-green-500 dark:text-green-400 mr-1">
                ✔️
              </span>
              <span>Sin marcas de agua</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 dark:text-green-400 mr-1">
                ✔️
              </span>
              <span>Descarga en PNG transparente</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 dark:text-green-400 mr-1">
                ✔️
              </span>
              <span>100% online y seguro</span>
            </li>
          </ul>
        </div>{" "}
        <div className="flex-1 flex items-center justify-center relative z-0">
          {/* Decorative blob */}
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-pink-100 dark:bg-pink-900/30 rounded-full blur-2xl opacity-60 dark:opacity-30 -z-10 transition-colors duration-300"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50 dark:opacity-20 -z-10 transition-colors duration-300"></div>

          {/* Video de YouTube responsivo */}
          <div className="w-full aspect-video max-w-md mx-auto rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg dark:shadow-2xl overflow-hidden transition-colors duration-300">
            <iframe
              src="https://www.youtube.com/embed/t9OjTltR6FY"
              title="Video tutorial Remove Background"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>
      <section
        id="como-funciona"
        className="mt-16 w-full max-w-3xl text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--foreground)] transition-colors duration-300">
          ¿Cómo funciona?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="card flex-1 bg-[var(--secondary)] transition-colors duration-300">
            <span className="text-pink-500 dark:text-pink-400 text-3xl font-bold mb-2 block transition-colors duration-300">
              1
            </span>
            <p className="font-semibold mb-1 text-[var(--foreground)] transition-colors duration-300">
              Sube tu imagen
            </p>
            <p className="text-[var(--foreground)]/70 text-sm transition-colors duration-300">
              Selecciona cualquier foto desde tu dispositivo.
            </p>
          </div>
          <div className="card flex-1 bg-[var(--secondary)] transition-colors duration-300">
            <span className="text-pink-500 dark:text-pink-400 text-3xl font-bold mb-2 block transition-colors duration-300">
              2
            </span>
            <p className="font-semibold mb-1 text-[var(--foreground)] transition-colors duration-300">
              Procesa en segundos
            </p>
            <p className="text-[var(--foreground)]/70 text-sm transition-colors duration-300">
              Nuestro sistema elimina el fondo automáticamente.
            </p>
          </div>
          <div className="card flex-1 bg-[var(--secondary)] transition-colors duration-300">
            <span className="text-pink-500 dark:text-pink-400 text-3xl font-bold mb-2 block transition-colors duration-300">
              3
            </span>
            <p className="font-semibold mb-1 text-[var(--foreground)] transition-colors duration-300">
              Descarga tu imagen
            </p>
            <p className="text-[var(--foreground)]/70 text-sm transition-colors duration-300">
              Obtén tu foto lista en PNG transparente.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
