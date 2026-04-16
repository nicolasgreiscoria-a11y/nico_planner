import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitCircuit",
  description: "Your weekly planner and habit tracker",
  metadataBase: new URL("https://nico-planner.vercel.app"),
  openGraph: {
    title: "HabitCircuit — Weekly Planner & Habit Tracker",
    description: "Stop drifting. Start doing. One system for your schedule, habits, tasks, and daily notes.",
    type: "website",
    url: "https://nico-planner.vercel.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {children}
      </body>
    </html>
  );
}
