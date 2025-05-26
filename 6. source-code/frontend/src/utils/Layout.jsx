// Layout.js
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -50,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
};

const Layout = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    <Outlet />
  </motion.div>
);

export default Layout;
