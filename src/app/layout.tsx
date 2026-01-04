import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algedi CMS",
  description: "Multi-Tenant E-Commerce Platform CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

