
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../components/WelcomeScreen';
import ManualSolveMode from '../components/ManualSolveMode';
import AISolveMode from '../components/AISolveMode';
import '../styles/Index.css';

const Index = () => {
  const [currentMode, setCurrentMode] = useState('welcome');
  const gridSize = 3; // Fixed to 3x3
  
  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
  };
  
  const handleBackToWelcome = () => {
    setCurrentMode('welcome');
  };

  // Page transition variants
  const pageVariants = {
    initial: (direction) => {
      return {
        x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0,
        opacity: 0
      };
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction) => {
      return {
        x: direction === 'right' ? '-100%' : direction === 'left' ? '100%' : 0,
        opacity: 0,
        transition: {
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 }
        }
      };
    }
  };

  return (
    <div className="puzzle-app">
      <AnimatePresence mode="wait" initial={false}>
        {currentMode === 'welcome' && (
          <motion.div 
            key="welcome"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="screen-container"
          >
            <WelcomeScreen 
              onModeSelect={handleModeSelect}
            />
          </motion.div>
        )}
        
        {currentMode === 'manual' && (
          <motion.div 
            key="manual"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            custom="right"
            className="screen-container"
          >
            <ManualSolveMode 
              gridSize={gridSize}
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}
        
        {currentMode === 'ai' && (
          <motion.div 
            key="ai"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            custom="left"
            className="screen-container"
          >
            <AISolveMode 
              gridSize={gridSize}
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
