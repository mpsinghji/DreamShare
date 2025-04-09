import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialSync: The Social Media Platform",
  description:
    "SocialSync is a social media platform that allows you to connect with your friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
