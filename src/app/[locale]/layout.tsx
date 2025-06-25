import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import AppProvider from "@/components/app-provider";
import { Toaster } from "@/components/ui/sonner"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phở An Cồ",
  description: "A simple food ordering system",
  icons: {
    icon: "/muoi_tieu_goc.jpg",
    shortcut: "/muoi_tieu_goc.jpg",
    apple: "/muoi_tieu_goc.jpg",
  },
};

export default async function RootLayout({
  children,
  modal,
  params
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  
  return (
    <html 
      lang={locale} 
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
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
