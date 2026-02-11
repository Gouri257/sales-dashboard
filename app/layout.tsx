import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Dashboard — Superstore Analytics",
  description:
    "Interactive sales analytics dashboard for 2022–2024. Built with Next.js 15, TypeScript, Recharts, and Tailwind CSS.",
  keywords: ["sales", "dashboard", "analytics", "recharts", "next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
