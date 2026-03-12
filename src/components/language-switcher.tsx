"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    // If we are currently in 'ja', switch to 'en' (which just removes the /ja due to middleware or sets to /en)
    // If we are currently in 'en', switch to 'ja'
    const newLang = currentLang === "en" ? "ja" : "en";

    // pathname from next/navigation always starts with a slash
    if (!pathname) return;

    let newPathname = pathname;
    
    // Check if the current pathname starts with /ja/ or is exactly /ja
    const isJaPath = pathname.startsWith('/ja/') || pathname === '/ja';
    const isEnPath = pathname.startsWith('/en/') || pathname === '/en';

    if (currentLang === "en" && newLang === "ja") {
      if (isEnPath) {
        newPathname = pathname.replace(/^\/en/, '/ja');
      } else {
        newPathname = `/ja${pathname === '/' ? '' : pathname}`;
      }
    } else if (currentLang === "ja" && newLang === "en") {
        newPathname = pathname.replace(/^\/ja/, '');
        if (newPathname === '') newPathname = '/';
    }

    router.push(newPathname);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-slate-600 hover:text-slate-900 font-medium px-3 flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs uppercase tracking-wider font-bold">
        {currentLang === "en" ? "JP/EN" : "EN/JP"}
      </span>
    </Button>
  );
}
