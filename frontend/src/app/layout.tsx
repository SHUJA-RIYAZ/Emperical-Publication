import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/navigation";
import { getSettings } from "@/services/settings.service";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

/** Titles and descriptions follow whatever the admin saves in Site Settings. */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.shortName}`,
    },
    description: site.description,
    keywords: [
      "academic publishing",
      "scholarly books",
      "peer-reviewed journals",
      "publish your book",
      "international publisher",
    ],
    openGraph: {
      title: site.name,
      description: site.description,
      type: "website",
      siteName: site.name,
      url: SITE_URL,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <SiteChrome>{children}</SiteChrome>
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
