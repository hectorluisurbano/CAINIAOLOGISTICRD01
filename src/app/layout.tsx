import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAINAO SHIPPING",
  description: "Gestión logística nacional e internacional - RD & China",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="bg-yale-blue text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              CAINAO <span className="text-mikado-yellow">SHIPPING</span>
            </h1>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-mikado-yellow transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-mikado-yellow transition-colors">Envíos</Link></li>
                <li><Link href="#" className="hover:text-mikado-yellow transition-colors">Almacén</Link></li>
                <li><Link href="#" className="hover:text-mikado-yellow transition-colors">Perfil</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-6">
          {children}
        </main>
        <footer className="bg-slate-100 p-4 border-t text-center text-sm text-slate-600">
          © {new Date().getFullYear()} CAINAO SHIPPING. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
