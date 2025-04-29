
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PuzzleGrid.css';

const PuzzleGrid = ({ 
  gridSize, 
  puzzle, 
  setPuzzle, 
  isEditable = true, 
  highlightTile = null,
  isSolved = false
}) => {
  const handleTileClick = (index) => {
    if (!isEditable || isSolved) return;
    
    const emptyIndex = puzzle.findIndex(tile => tile === 0);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    const tileRow = Math.floor(index / gridSize);
    const tileCol = index % gridSize;
    
    // Check if tile is adjacent to empty space
    if (
      (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
      (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow)
    ) {
      // Make a copy of the puzzle
      const newPuzzle = [...puzzle];
      // Swap the tile with the empty space
      newPuzzle[emptyIndex] = puzzle[index];
      newPuzzle[index] = 0;
      // Update the puzzle
      setPuzzle(newPuzzle);
    }
  };
  
  const getPositionFromIndex = (index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return { row, col };
  };

  const isTileMovable = (index) => {
    if (!isEditable || puzzle[index] === 0) return false;
    
    const emptyIndex = puzzle.findIndex(tile => tile === 0);
    const emptyPos = getPositionFromIndex(emptyIndex);
    const tilePos = getPositionFromIndex(index);
    
    return (
      (Math.abs(emptyPos.row - tilePos.row) === 1 && emptyPos.col === tilePos.col) ||
      (Math.abs(emptyPos.col - tilePos.col) === 1 && emptyPos.row === tilePos.row)
    );
  };

  const tileVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: 0.05 
      } 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" 
    },
    solved: {
      scale: [1, 1.1, 1],
      backgroundColor: ["#9b87f5", "#7E69AB", "#9b87f5"],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div 
      className="puzzle-grid" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}
    >
      {puzzle.map((tileValue, index) => {
        const isMovable = isTileMovable(index);
        const isHighlighted = index === highlightTile;
        
        return (
          <AnimatePresence key={tileValue}>
            {tileValue !== 0 ? (
              <motion.div
                className={`puzzle-tile ${isMovable ? 'movable' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                layout
                key={tileValue}
                initial="initial"
                animate={isSolved ? "solved" : "animate"}
                whileHover={isMovable && !isSolved ? "hover" : undefined}
                variants={tileVariants}
                onClick={() => handleTileClick(index)}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
              >
                {tileValue}
              </motion.div>
            ) : (
              <div className="puzzle-tile empty"></div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default PuzzleGrid;
