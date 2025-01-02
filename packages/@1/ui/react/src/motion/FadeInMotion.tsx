//

import { motion, type MotionProps } from "motion/react";

//

export function FadeInMotion({ children, ...motion_props }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.42 }}
      {...motion_props}
    >
      {children}
    </motion.div>
  );
}
