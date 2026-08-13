"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll reveal. Timing matches the design prototype:
 * translateY(26px), 0.75s, cubic-bezier(.2,.7,.3,1).
 *
 * Reduced motion is resolved HERE, once. When it is on, children render
 * fully visible with no transform — never hidden.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.75, ease: [0.2, 0.7, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
