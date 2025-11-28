import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700', '800'],
});

export const metadata: Metadata = {
  title: "ShiftLink_V1 // Terminal",
  description: "Protocol for secure cross-chain transfers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`}>
      <body className="font-mono min-h-screen flex items-center justify-center p-4 relative" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}