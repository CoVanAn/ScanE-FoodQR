import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import AppProvider from "@/components/app-provider";
import { Toaster } from "@/components/ui/sonner"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScanE",
  description: "A simple food ordering system",
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      style={{ display: 'block' }}
      className={cn(
        // "bg-background text-foreground antialiased dark:bg-background-dark dark:text-foreground-dark",
        `${geistSans.variable} ${geistMono.variable} antialiased`
      )}
    >
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {modal}
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
