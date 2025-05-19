"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <main className="landing-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header con login */}
      <header className="w-full max-w-4xl flex justify-end items-center mb-4">
        {!isSignedIn ? (
          <a href="/sign-in">
            <span className="btn-primary px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform text-base">
              Iniciar sesión
            </span>
          </a>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </header>
      <section className="relative w-full max-w-4xl bg-white/80 rounded-2xl shadow-xl flex flex-col md:flex-row items-center p-8 gap-8">
        <div className="flex-1 flex flex-col items-start justify-center z-10">
          <span className="inline-block bg-[var(--accent)] text-pink-700 font-semibold px-4 py-1 rounded-full mb-4 text-sm shadow-sm">
            ¡Nuevo! 2024
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Elimina el fondo de tus imágenes{" "}
            <span className="text-pink-600">en segundos</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-md">
            Sube tu foto y obtén resultados profesionales al instante. Sin
            registros, sin complicaciones. ¡Haz que tus imágenes destaquen!
          </p>
          <div className="flex gap-4 mb-6 items-center">
            {!isSignedIn ? (
              <a href="/sign-in">
                <span className="btn-primary text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Probar gratis
                </span>
              </a>
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
              className="btn-secondary text-lg px-6 py-3 rounded-lg border border-pink-300 hover:bg-pink-50 transition-colors"
            >
              ¿Cómo funciona?
            </a>
          </div>
          <ul className="text-gray-600 text-sm space-y-1 mb-2">
            <li>✔️ Sin marcas de agua</li>
            <li>✔️ Descarga en PNG transparente</li>
            <li>✔️ 100% online y seguro</li>
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center relative z-0">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-pink-100 rounded-full blur-2xl opacity-60 -z-10"></div>
          {/* Video de YouTube responsivo */}
          <div className="w-full aspect-video max-w-md mx-auto rounded-2xl border-4 border-white shadow-lg overflow-hidden">
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          ¿Cómo funciona?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="card flex-1">
            <span className="text-pink-500 text-3xl font-bold mb-2 block">
              1
            </span>
            <p className="font-semibold mb-1">Sube tu imagen</p>
            <p className="text-gray-600 text-sm">
              Selecciona cualquier foto desde tu dispositivo.
            </p>
          </div>
          <div className="card flex-1">
            <span className="text-pink-500 text-3xl font-bold mb-2 block">
              2
            </span>
            <p className="font-semibold mb-1">Procesa en segundos</p>
            <p className="text-gray-600 text-sm">
              Nuestro sistema elimina el fondo automáticamente.
            </p>
          </div>
          <div className="card flex-1">
            <span className="text-pink-500 text-3xl font-bold mb-2 block">
              3
            </span>
            <p className="font-semibold mb-1">Descarga tu imagen</p>
            <p className="text-gray-600 text-sm">
              Obtén tu foto lista en PNG transparente.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
