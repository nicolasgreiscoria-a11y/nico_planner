import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: "HabitCircuit",
  description: "Your weekly planner and habit tracker",
  metadataBase: new URL("https://habitcircuitapp.com"),
  openGraph: {
    title: "HabitCircuit — Weekly Planner & Habit Tracker",
    description: "Stop drifting. Start doing. One system for your schedule, habits, tasks, and daily notes.",
    type: "website",
    url: "https://habitcircuitapp.com",
    siteName: "HabitCircuit",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitCircuit — Weekly Planner & Habit Tracker",
    description: "Stop drifting. Start doing. One system for your schedule, habits, tasks, and daily notes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
