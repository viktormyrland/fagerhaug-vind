import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Fagerhaug Vind",
  description: "Sanntid vinddata fra ENOP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Suspense>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
