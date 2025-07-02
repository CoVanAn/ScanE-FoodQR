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
  title: {
    default: "Phở An Cồ - Nhà hàng Phở truyền thống Việt Nam",
    template: "%s | Phở An Cồ"
  },
  description: "Nhà hàng Phở An Cồ - Nơi mang đến hương vị phở truyền thống Việt Nam với menu đa dạng, không gian ấm cúng và dịch vụ tận tâm. Đặt món online nhanh chóng!",
  keywords: ["phở", "nhà hàng", "món việt", "phở truyền thống", "đặt món online", "vietnamese restaurant", "phở an cồ"],
  authors: [{ name: "Phở An Cồ Restaurant" }],
  creator: "Phở An Cồ",
  publisher: "Phở An Cồ",
  metadataBase: new URL('https://your-domain.com'), // Thay bằng domain thật
  alternates: {
    canonical: "/",
    languages: {
      'vi': '/vi',
      'en': '/en',
    },
  },
  openGraph: {
    title: "Phở An Cồ - Nhà hàng Phở truyền thống Việt Nam",
    description: "Nhà hàng Phở An Cồ - Nơi mang đến hương vị phở truyền thống Việt Nam với menu đa dạng, không gian ấm cúng và dịch vụ tận tâm.",
    url: "https://your-domain.com",
    siteName: "Phở An Cồ Restaurant",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Phở An Cồ - Nhà hàng Phở truyền thống",
      },
    ],
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phở An Cồ - Nhà hàng Phở truyền thống Việt Nam",
    description: "Nhà hàng Phở An Cồ - Nơi mang đến hương vị phở truyền thống Việt Nam với menu đa dạng.",
    images: ["/banner.jpg"],
    creator: "@pho_an_co",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "your-google-verification-code", // Thêm khi có
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
