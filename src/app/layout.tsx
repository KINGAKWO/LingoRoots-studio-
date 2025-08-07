import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const metadata: Metadata = {
  title: 'LingoRoots - Learn Duala',
  description: 'Interactive Duala language learning platform with AI feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a QueryClient instance (should be memoized to avoid recreation)
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                {children}
                <Toaster />
              </ThemeProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}