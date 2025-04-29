
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = ({ onModeSelect }) => {
  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="welcome-title"
        variants={itemVariants}
      >
        3×3 Puzzle Solver
      </motion.h1>
      
      <motion.p 
        className="welcome-subtitle"
        variants={itemVariants}
      >
        Visualize and solve the sliding puzzle problem using our Visualizer!
      </motion.p>
      
      <motion.div 
        className="mode-buttons"
        variants={itemVariants}
      >
        <motion.button
          className="mode-button manual-button"
          onClick={() => onModeSelect('manual')}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="button-text">Solve Manually</span>
          <span className="button-icon">→</span>
        </motion.button>
        
        <motion.button
          className="mode-button ai-button"
          onClick={() => onModeSelect('ai')}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="button-text">Solve Using AI</span>
          <span className="button-icon">→</span>
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="welcome-info"
        variants={itemVariants}
      >
        <p>Development by Subodh | Design by Namee Jain | Contributions by Nikhil Kannouje.</p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
