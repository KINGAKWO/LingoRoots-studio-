import { Languages } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 28, textSize = "text-2xl" }: LogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <Languages className="text-primary" size={iconSize} data-ai-hint="language learning" />
      <span className={`font-headline font-bold ${textSize} text-primary`}>LingoRoots</span>
    </Link>
  );
}
