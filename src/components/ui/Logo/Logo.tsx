import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "brand" | "white";
}

export function Logo({ className, variant = "brand" }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <Image
        src={variant === "white" ? "/images/logo-svg-white.svg" : "/images/logo-svg.svg"}
        alt="TechEniac"
        width={150}
        height={30}
        priority
        data-site-logo
      />
    </Link>
  );
}