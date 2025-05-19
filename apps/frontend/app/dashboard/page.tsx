import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Proteger la ruta: si no hay usuario, redirigir al login
  const user = await currentUser();
  if (!user) redirect('/');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <header className="w-full max-w-md flex flex-col items-center mb-8">
        <UserButton afterSignOutUrl="/" />
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-1 mt-4 tracking-tight">Bienvenido a tu Dashboard</h1>
        <p className="text-[var(--muted)] text-base text-center">Ya puedes comenzar a eliminar fondos de imágenes.</p>
      </header>
      {/* Aquí puedes agregar el componente principal de la app */}
    </div>
  );
}
