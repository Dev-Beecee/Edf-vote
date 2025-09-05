import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/footer/Footer";
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({ subsets: ["latin"] });

// Font EDF 2020
const edf2020 = localFont({
  src: [
    { path: './fonts/edf-2020-light.woff2', weight: '300', style: 'normal' },
    { path: './fonts/edf-2020.woff2', weight: '400', style: 'normal' },
    { path: './fonts/edf-2020-bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/edf-2020-italic.woff2', weight: '400', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-edf2020',
});

// Font Hore
const hore = localFont({
  src: [
    { path: './fonts/hore.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-hore',
});

// Font Work Sans
const workSans = localFont({
  src: [
    { path: './fonts/work-sans-semibold.woff2', weight: '400', style: 'normal' },
    { path: './fonts/work-sans-semibold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/work-sans-bold-italic.woff2', weight: '700', style: 'italic' },
    { path: './fonts/work-sans-italic.woff2', weight: '400', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: "Shadcn - Landing template",
  description: "Landing template from Shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className, edf2020.variable, hore.variable, workSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div data-navbar>
            <Navbar />
          </div>

          {children}
          
          <div data-footer>
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
