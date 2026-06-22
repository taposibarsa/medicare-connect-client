'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1.5, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = Number(value) || 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const current = Math.floor(progress * end);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };

    requestAnimationFrame(tick);
    return () => {
      start = end;
    };
  }, [isInView, value, duration]);

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
