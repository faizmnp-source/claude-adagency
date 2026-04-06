/**
 * AnimatedCounter — counts from 0 to target when scrolled into view
 * skill: scroll-experience
 */
import { useEffect, useRef, useState } from 'react';

interface Props {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // ms
}

export const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 1800 }: Props) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
};
