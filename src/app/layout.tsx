import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { MoodProvider } from "@/components/providers/MoodProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { GlobalHeader } from "@/components/GlobalHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibed to Cracked - JavaScript Learning with Mood",
  description:
    "Learn JavaScript at your own pace with mood-driven content. Choose chill, rush, or grind mode for personalized learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black min-h-screen`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <MoodProvider>
                <ToastProvider>
                  <GlobalHeader />
                  <main>{children}</main>
                </ToastProvider>
              </MoodProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
