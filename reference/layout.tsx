import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "../styles/globals.css";
import LayoutShell from "../components/features/common/LayoutShell";
import BreadcrumbSchema from "../components/features/common/BreadcrumbSchema";
import RouteLoadingBar from "../components/features/common/RouteLoadingBar";
import StyledComponentsRegistry from "../lib/StyledComponentsRegistry";
import { paths } from "../routes/paths";
import { getMenuByLocation } from "../lib/menus/menus";
import { SPLASH_BOOT_SCRIPT, SPLASH_ENABLED } from "../components/organisms/SplashScreen";

// Off: replaced by the custom ChatLauncher widget (LayoutShell). Flip to
// restore the third-party Botsailor floating chat button.
const ENABLE_BOTSAILOR_WIDGET = false;

const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/general-sans/GeneralSans-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#425ef9",
};

export const metadata: Metadata = {
  metadataBase: new URL(paths.techeniac),
  robots: { index: true, follow: true },
  alternates: {
    languages: {
      "en-US": paths.techeniac,
      "en-IN": paths.techeniac,
      "x-default": paths.techeniac,
    },
  },
  openGraph: {
    type: "website",
    siteName: "TechEniac",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch every menu once per request. unstable_cache caches by location tag,
  // so admin saves invalidate just the affected location and the rest stay warm.
  const [
    headerPrimary,
    headerMobile,
    footerAbout,
    footerServices,
    footerLegal,
  ] = await Promise.all([
    getMenuByLocation("header_primary"),
    getMenuByLocation("header_mobile"),
    getMenuByLocation("footer_about"),
    getMenuByLocation("footer_services"),
    getMenuByLocation("footer_legal"),
  ]);

  return (
    <html lang="en" className={generalSans.variable} suppressHydrationWarning>
      <head>
        {/* Must run before first paint; see SplashScreen/data.ts. Off while SPLASH_ENABLED is false. */}
        {SPLASH_ENABLED && <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }} />}
        <meta
          name="google-site-verification"
          content="x1W46WGg-NvUFlA_dbt0ZbWIOoNSMV3cq2_CCzC-xfc"
        />
        <link rel="icon" href="/favicon.png" />
        {/* Resource hint for GTM/GA — saves DNS+TLS handshake on first analytics call */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P2M7GQ2D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P2M7GQ2D');`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5CVCM7S1ZW"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-5CVCM7S1ZW');`,
          }}
        />

        {/* Disabled — superseded by the custom ChatLauncher widget
            (LayoutShell). Botsailor's own widget code adds a built-in 5s
            delay before mounting its floating button, so afterInteractive
            was used (no lazyOnload needed on top of that) when this was
            live. Flip ENABLE_BOTSAILOR_WIDGET to restore it; kept in place
            rather than deleted in case ChatLauncher needs to be rolled
            back. */}
        {ENABLE_BOTSAILOR_WIDGET && (
          <Script
            src="https://botsailor.com/script/webchat-link.js?code=1779193490287796"
            strategy="afterInteractive"
          />
        )}

        <BreadcrumbSchema />
        <RouteLoadingBar />
        <StyledComponentsRegistry>
          <LayoutShell
            headerPrimary={headerPrimary}
            headerMobile={headerMobile}
            footerAbout={footerAbout}
            footerServices={footerServices}
            footerLegal={footerLegal}
          >
            {children}
          </LayoutShell>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
