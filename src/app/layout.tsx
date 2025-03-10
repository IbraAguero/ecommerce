import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
