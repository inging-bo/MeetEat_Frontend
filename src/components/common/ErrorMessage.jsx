import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorMessage = ({ message, duration = 3000, persistent = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message && !persistent) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, persistent]);

  return (
    <div className="text-sm text-[#FF0000] mt-2 min-h-5">
      <AnimatePresence mode="wait">
        {(isVisible || persistent) && message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.1 }}
          >
            {message}
          </motion.p>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            &nbsp;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorMessage;
