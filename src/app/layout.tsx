import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive 3D Particles",
  description: "Real-time hand-controlled particle system",
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
