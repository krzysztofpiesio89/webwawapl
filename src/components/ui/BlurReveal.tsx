'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface BlurRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function BlurReveal({ 
  children, 
  delay = 0, 
  className = '',
  threshold = 0.1
}: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-[opacity,transform,filter] ${
        isVisible
          ? 'opacity-100 blur-0 translate-y-0'
          : 'opacity-0 blur-[12px] translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}
