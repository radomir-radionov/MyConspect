import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { ResourcesAutoRefresh } from "@/components/dev/ResourcesAutoRefresh";
import { HandbookShell } from "@/components/nav";
import { withoutSearchText } from "@/lib/nav/chromeNav";
import { handbookNav } from "@/lib/nav/handbook";
import { CHROME } from "@/lib/nav";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import {
  formatSiteLastUpdated,
  siteLastUpdatedIso,
} from "@/lib/siteLastUpdated";
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
  const lastUpdatedIso = siteLastUpdatedIso();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
    >
      <body className="h-full overflow-hidden bg-zinc-50 font-sans text-zinc-900">
        <ResourcesAutoRefresh />
        <HandbookShell
          groups={withoutSearchText(handbookNav())}
          chrome={CHROME}
          lastUpdatedIso={lastUpdatedIso}
          lastUpdatedLabel={formatSiteLastUpdated(lastUpdatedIso)}
        >
          {children}
        </HandbookShell>
        <Analytics />
      </body>
    </html>
  );
}
