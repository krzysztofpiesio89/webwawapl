'use client';

import * as CookieConsent from 'vanilla-cookieconsent';

export default function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => CookieConsent.showPreferences()}
      className="hover:text-primary transition-colors cursor-pointer text-left bg-transparent border-none p-0 text-xs text-slate-500 dark:text-slate-400 font-inherit"
    >
      {label}
    </button>
  );
}
