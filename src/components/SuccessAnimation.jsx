
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/SuccessAnimation.css';

const SuccessAnimation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  return (
    <motion.div 
      className="success-animation"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="success-circle"
        variants={itemVariants}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      </motion.div>
      
      <motion.p 
        className="success-text"
        variants={itemVariants}
      >
        Puzzle Solved!
      </motion.p>
      
      <motion.div 
        className="confetti-container"
        variants={itemVariants}
        animate={{ 
          scale: [1, 1.2, 1],
          transition: { 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "mirror"
          }
        }}
      >
        <div className="confetti confetti-1"></div>
        <div className="confetti confetti-2"></div>
        <div className="confetti confetti-3"></div>
        <div className="confetti confetti-4"></div>
        <div className="confetti confetti-5"></div>
        <div className="confetti confetti-6"></div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;
