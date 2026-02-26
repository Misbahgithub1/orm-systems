// src/app/layout.tsx
import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.scss";

export const metadata: Metadata = {
  title: "Next.js eCommerce Frontend",
  description: "A pixel-perfect and fully responsive eCommerce frontend built with Next.js (App Router), implementing dynamic category listing, product filtering, search with debouncing, and product detail pages using FakeStore API. Designed with scalable architecture and clean state management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Forma DJR local font CSS */}
        <link rel="stylesheet" href="/fonts/fonts.css" />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}