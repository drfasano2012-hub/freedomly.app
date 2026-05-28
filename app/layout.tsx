import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freedomly — Money is a tool. Freedom is the goal.",
  description:
    "Get a clear picture of where you stand financially, benchmark against your peers, and find your concrete path to financial independence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
