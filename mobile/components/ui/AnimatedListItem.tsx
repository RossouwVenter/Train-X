import { MotiView } from "moti";
import type { ReactNode } from "react";

interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  /** Stagger delay per item in ms */
  delay?: number;
}

/**
 * Wraps a list item with a fade-up stagger animation.
 */
export function AnimatedListItem({
  children,
  index,
  delay = 80,
}: AnimatedListItemProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 350,
        delay: index * delay,
      }}
    >
      {children}
    </MotiView>
  );
}
