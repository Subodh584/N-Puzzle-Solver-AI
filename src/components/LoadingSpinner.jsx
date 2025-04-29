
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <motion.div 
        className="loading-spinner"
        animate={{ 
          rotate: 360,
          transition: { 
            duration: 1.5,
            ease: "linear",
            repeat: Infinity
          }
        }}
      >
        <div className="spinner-segment"></div>
      </motion.div>
      <p className="loading-text">Processing...</p>
    </div>
  );
};

export default LoadingSpinner;
