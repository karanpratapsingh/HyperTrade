import { HTMLMotionProps, motion } from 'framer-motion';

export function Div(props: HTMLMotionProps<'div'>): React.ReactElement {
  const { children } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}>
      {children}
    </motion.div>
  );
}
