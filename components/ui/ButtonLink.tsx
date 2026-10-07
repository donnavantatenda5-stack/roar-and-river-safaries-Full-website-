import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light" | "outline";

const styles: Record<Variant, string> = {
  dark: "bg-forest text-white hover:bg-forest-soft shadow-[0_10px_24px_rgba(18,40,26,0.28)]",
  light: "bg-white text-[#16201a] hover:bg-ivory shadow-[0_10px_24px_rgba(0,0,0,0.30)]",
  outline: "border-2 border-white/90 text-white hover:bg-white/10",
};

export default function ButtonLink({
  href,
  children,
  variant = "dark",
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const cls = cn(
    "inline-flex h-[58px] items-center justify-center gap-3 rounded-full px-8 text-[17px] font-bold transition-colors sm:h-[60px] sm:text-[19px]",
    styles[variant],
    className
  );
  const content = <>{children}</>;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
