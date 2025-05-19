import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InitWrapper from "./app-init";
import ThemeToggle from "@/components/ThemeToggle";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eliminador de Fondos de Imágenes",
  description:
    "Una aplicación para eliminar fondos de imágenes usando Next.js 15",
  authors: [{ name: "Remove Background Project" }],
  keywords: ["nextjs", "image processing", "background removal"],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeToggle />
          <InitWrapper />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
