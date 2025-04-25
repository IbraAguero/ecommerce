import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";

const poppins = Poppins({
  weight: ["200", "400", "500", "600", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYZA",
  description: "Tienda de ropa y accesorios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <Providers>
        <body
          className={`${poppins.className} min-h-screen flex flex-col dark`}
        >
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
