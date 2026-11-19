"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/src/components/organisms/Header";
import { Footer } from "@/src/components/organisms/Footer";
import { ChatLauncher } from "@/src/components/organisms/ChatLauncher";
import { SplashScreen, SPLASH_ENABLED } from "@/src/components/organisms/SplashScreen";
import type { MenuTree } from "@/src/lib/menus/menus";
import { paths } from "@/src/routes/paths";

const DARK_HEADER_ROUTES: string[] = [paths.aboutUs];

interface LayoutShellProps {
  children: React.ReactNode;
  headerPrimary: MenuTree;
  headerMobile: MenuTree;
  footerAbout: MenuTree;
  footerServices: MenuTree;
  footerLegal: MenuTree;
}

export default function LayoutShell({
  children,
  headerPrimary,
  headerMobile,
  footerAbout,
  footerServices,
  footerLegal,
}: LayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const headerVariant = !isAdmin && DARK_HEADER_ROUTES.includes(pathname) ? "dark" : "light";

  // Belt-and-suspenders on top of Next's own scroll-to-top-on-navigation:
  // force an instant jump so it can't be caught mid-animation (the bug
  // that was happening while `scroll-behavior: smooth` was global). Skipped
  // when the URL has a hash (e.g. footer's /#healthtech links) so in-page
  // anchor navigation isn't fought.
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  // Safari's rubber-band overscroll bounce (top/bottom) paints <html>'s
  // background — match it to the dark header on routes that have one, so
  // overscrolling at the top doesn't flash white against a dark hero.
  useEffect(() => {
    document.documentElement.style.backgroundColor =
      headerVariant === "dark" ? "var(--color-neutral-700)" : "";
  }, [headerVariant]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {SPLASH_ENABLED && <SplashScreen />}
      <Header variant={headerVariant} primary={headerPrimary} mobile={headerMobile} />
      {children}
      <Footer about={footerAbout} services={footerServices} legal={footerLegal} />
      <ChatLauncher />
    </>
  );
}
