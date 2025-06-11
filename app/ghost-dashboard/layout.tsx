import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Admin Dashboard",
    description: "Zone d'administration",
};

export default function GhostDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={cn("min-h-screen bg-background", inter.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* PAS DE NAVBAR ICI */}
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
