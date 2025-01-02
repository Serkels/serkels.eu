//

import { motion, type MotionProps } from "motion/react";

//

export function AppearMotion({ children, ...motion_props }: MotionProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      {...motion_props}
    >
      {children}
    </motion.div>
  );
}
