import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../styles/age-themes.css';
import '../styles/enhanced-themes.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoryProvider } from '@/contexts/StoryContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DarkModeProvider } from '@/components/DarkModeProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wove - Interactive Storytelling Platform',
  description: 'Create and explore immersive, collaborative stories with Wove',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-oid="219fygd">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-oid="2s5qrja"
      >
        <AuthProvider data-oid="hji-j6:">
          <DarkModeProvider data-oid="eym7pn2">
            <ThemeProvider data-oid="ambr1ve">
              <NotificationProvider data-oid="8x2-9g2">
                <StoryProvider data-oid="7jvnsva">{children}</StoryProvider>
              </NotificationProvider>
            </ThemeProvider>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
