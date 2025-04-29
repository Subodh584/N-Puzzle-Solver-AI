
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PuzzleGrid from './PuzzleGrid';
import SuccessAnimation from './SuccessAnimation';
import { generateRandomPuzzle, isPuzzleSolved } from '../utils/puzzleUtils';
import '../styles/ManualSolveMode.css';

const ManualSolveMode = ({ gridSize, onBack }) => {
  const [puzzle, setPuzzle] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  
  // Initialize the puzzle
  useEffect(() => {
    resetPuzzle();
  }, [gridSize]);
  
  // Check if the puzzle is solved
  useEffect(() => {
    if (puzzle.length === 0) return;
    
    if (isPuzzleSolved(puzzle, gridSize)) {
      setIsSolved(true);
    }
  }, [puzzle, gridSize]);
  
  // Track moves
  useEffect(() => {
    if (puzzle.length === 0) return;
    
    if (!startTime && moves === 0) {
      setStartTime(Date.now());
    } else if (moves > 0) {
      setMoves(moves + 1);
    }
  }, [puzzle]);
  
  // Timer
  useEffect(() => {
    if (!startTime || isSolved) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isSolved]);
  
  const resetPuzzle = () => {
    const newPuzzle = generateRandomPuzzle(gridSize);
    setPuzzle(newPuzzle);
    setMoves(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsSolved(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="manual-solve-mode"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 
        className="mode-title"
        variants={itemVariants}
      >
        Solve Manually
      </motion.h2>
      
      <motion.div 
        className="puzzle-container"
        variants={itemVariants}
      >
        <PuzzleGrid 
          gridSize={gridSize} 
          puzzle={puzzle} 
          setPuzzle={setPuzzle}
          isSolved={isSolved}
        />
        
        {isSolved && <SuccessAnimation />}
      </motion.div>
      
      <motion.div 
        className="stats-container"
        variants={itemVariants}
      >
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(elapsedTime)}</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="controls-container"
        variants={itemVariants}
      >
        <motion.button
          className="control-button reset-button"
          onClick={resetPuzzle}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Reset Puzzle
        </motion.button>
        
        <motion.button
          className="control-button back-button"
          onClick={onBack}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          ← Back to Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ManualSolveMode;
