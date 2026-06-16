'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface BlurRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}

/**
 * BlurReveal — astro.build-style blur+fade+lift reveal on scroll.
 *
 * Perf notes:
 * - Uses CSS @keyframes animation (GPU-composited: opacity + transform only).
 * - `filter: blur` is applied only during the animation via `data-reveal` attribute,
 *   so the compositor layer is created only when needed and immediately released.
 * - `will-change` is NOT set globally — browser allocates layers lazily via CSS animation.
 * - IntersectionObserver fires once then disconnects — zero ongoing JS cost.
 * - Initial state is set via inline style (not className) to avoid FOUC on SSR.
 */
export function BlurReveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
}: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger CSS animation via data attribute
          el.setAttribute('data-reveal', 'visible');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      data-reveal="hidden"
      style={{ animationDelay: `${delay}ms` }}
      className={`blur-reveal ${className}`}
    >
      {children}
    </div>
  );
}
