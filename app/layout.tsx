import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Свадебное RSVP",
  description: "Приглашение и подтверждение присутствия",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}