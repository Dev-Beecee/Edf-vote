import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GhostLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={cn("min-h-screen bg-background", inter.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
