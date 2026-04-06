/**
 * ScrollReveal — Intersection Observer wrapper
 * skill: scroll-experience
 * Fades + slides children in when they enter the viewport.
 */
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;         // ms stagger delay
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  style?: CSSProperties;
}

export const ScrollReveal = ({ children, delay = 0, direction = 'up', className, style }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const translateMap = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' };
    el.style.opacity = '0';
    el.style.transform = translateMap[direction];
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return <div ref={ref} className={className} style={style}>{children}</div>;
};
