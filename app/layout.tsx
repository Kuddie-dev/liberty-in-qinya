import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Liberty In Qinya - News",
  description: "Official news portal of Liberty In Qinya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-liq-dark">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
