'use client';

import * as CookieConsent from 'vanilla-cookieconsent';

export default function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => CookieConsent.showPreferences()}
      className="hover:text-primary transition-colors cursor-pointer text-left bg-transparent border-none p-0 text-xs text-slate-700 dark:text-slate-300 font-inherit underline-offset-2 hover:underline"
    >
      {label}
    </button>
  );
}
