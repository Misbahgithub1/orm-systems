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
        {/* Google Fonts professional embed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}