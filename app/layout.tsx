import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HandbookShell } from "@/components/HandbookShell";
import { handbookNav } from "@/lib/content/handbook-nav";
import { CHROME } from "@/lib/content/nav";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

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
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-full overflow-hidden bg-zinc-50 font-sans text-zinc-900">
        <HandbookShell groups={handbookNav()} chrome={CHROME}>
          {children}
        </HandbookShell>
      </body>
    </html>
  );
}
