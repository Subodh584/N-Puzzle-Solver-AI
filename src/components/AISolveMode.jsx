
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PuzzleGrid from './PuzzleGrid';
import GraphVisualization from './GraphVisualization';
import LoadingSpinner from './LoadingSpinner';
import SuccessAnimation from './SuccessAnimation';
import { generateRandomPuzzle, isPuzzleSolved } from '../utils/puzzleUtils';
import { aStarSearch } from '../algorithms/aStar';
import { bfsSearch } from '../algorithms/bfs';
import '../styles/AISolveMode.css';

const AISolveMode = ({ gridSize, onBack }) => {
  const [puzzle, setPuzzle] = useState([]);
  const [algorithm, setAlgorithm] = useState('astar');
  const [speed, setSpeed] = useState(500); // milliseconds per move
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionPath, setSolutionPath] = useState([]);
  const [exploredNodes, setExploredNodes] = useState([]);
  const [exploredEdges, setExploredEdges] = useState([]);
  const [stats, setStats] = useState({
    nodesExplored: 0,
    pathLength: 0,
    timeElapsed: 0
  });
  
  const solveTimeoutRef = useRef(null);
  
  // Initialize the puzzle
  useEffect(() => {
    resetPuzzle();
  }, [gridSize]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (solveTimeoutRef.current) {
        clearTimeout(solveTimeoutRef.current);
      }
    };
  }, []);
  
  const resetPuzzle = () => {
    // Clear any ongoing solution
    if (solveTimeoutRef.current) {
      clearTimeout(solveTimeoutRef.current);
    }
    
    const newPuzzle = generateRandomPuzzle(gridSize);
    setPuzzle(newPuzzle);
    setSolutionPath([]);
    setExploredNodes([]);
    setExploredEdges([]);
    setCurrentStep(0);
    setIsSolving(false);
    setIsSolved(false);
    setStats({
      nodesExplored: 0,
      pathLength: 0,
      timeElapsed: 0
    });
  };
  
  const startSolving = async () => {
    if (isSolving) return;
    
    setIsSolving(true);
    setIsSolved(false);
    setSolutionPath([]);
    setExploredNodes([]);
    setExploredEdges([]);
    setCurrentStep(0);
    
    const startTime = Date.now();
    
    // Update function for visualization
    const updateGraph = (nodes, edges) => {
      setExploredNodes(nodes);
      setExploredEdges(edges);
    };
    
    let result;
    if (algorithm === 'astar') {
      result = await aStarSearch(puzzle, gridSize, updateGraph);
    } else {
      result = await bfsSearch(puzzle, gridSize, updateGraph);
    }
    
    const endTime = Date.now();
    const timeElapsed = (endTime - startTime) / 1000;
    
    setSolutionPath(result.path);
    setExploredNodes(result.exploredNodes);
    setExploredEdges(result.exploredEdges);
    
    setStats({
      nodesExplored: result.exploredNodes.length,
      pathLength: result.path.length,
      timeElapsed
    });
    
    if (result.path.length > 0) {
      // Start stepping through the solution
      animateSolution(result.path);
    } else {
      setIsSolving(false);
      alert("No solution found!");
    }
  };
  
  const animateSolution = (path) => {
    let step = 0;
    
    const animateStep = () => {
      if (step < path.length) {
        setPuzzle(path[step]);
        setCurrentStep(step);
        
        step++;
        
        // Check if we've reached the end
        if (step === path.length) {
          setIsSolving(false);
          setIsSolved(true);
        } else {
          solveTimeoutRef.current = setTimeout(animateStep, speed);
        }
      }
    };
    
    animateStep();
  };
  
  const handleSpeedChange = (e) => {
    const newSpeed = 1000 - e.target.value;
    setSpeed(newSpeed);
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

  // Determine which tile to highlight based on the current and next step
  const getHighlightedTile = () => {
    if (!isSolving || currentStep + 1 >= solutionPath.length) return null;
    
    const currentState = solutionPath[currentStep];
    const nextState = solutionPath[currentStep + 1];
    
    // Find the empty tile in the current state
    const emptyIndex = currentState.findIndex(tile => tile === 0);
    
    // Find the index of the tile that moved to the empty position
    return nextState.findIndex(tile => tile === 0);
  };

  return (
    <motion.div 
      className="ai-solve-mode"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 
        className="mode-title"
        variants={itemVariants}
      >
        Solve Using AI
      </motion.h2>
      
      <motion.div 
        className="puzzle-and-graph"
        variants={itemVariants}
      >
        <div className="puzzle-section">
          <PuzzleGrid 
            gridSize={gridSize} 
            puzzle={puzzle} 
            setPuzzle={setPuzzle}
            isEditable={!isSolving && !isSolved}
            highlightTile={getHighlightedTile()}
            isSolved={isSolved}
          />
          
          {isSolved && <SuccessAnimation />}
          {isSolving && <LoadingSpinner />}
        </div>
        
        <div className="graph-section">
          <GraphVisualization 
            nodes={exploredNodes} 
            edges={exploredEdges}
            currentNodeIndex={currentStep}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="controls-section"
        variants={itemVariants}
      >
        <div className="algorithm-selector">
          <label>Algorithm:</label>
          <div className="algorithm-buttons">
            <button 
              className={`algorithm-button ${algorithm === 'astar' ? 'selected' : ''}`}
              onClick={() => setAlgorithm('astar')}
              disabled={isSolving}
            >
              A* (Manhattan)
            </button>
            <button 
              className={`algorithm-button ${algorithm === 'bfs' ? 'selected' : ''}`}
              onClick={() => setAlgorithm('bfs')}
              disabled={isSolving}
            >
              BFS
            </button>
          </div>
        </div>
        
        <div className="speed-control">
          <label>Speed:</label>
          <input 
            type="range" 
            min="0" 
            max="900" 
            value={1000 - speed}
            onChange={handleSpeedChange}
            disabled={isSolving}
            className="slider"
          />
          <div className="speed-labels">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
        
        <div className="solve-buttons">
          <motion.button
            className="solve-button start-button"
            onClick={startSolving}
            disabled={isSolving}
            variants={buttonVariants}
            whileHover={!isSolving ? "hover" : undefined}
            whileTap={!isSolving ? "tap" : undefined}
          >
            {isSolving ? 'Solving...' : 'Start Solving'}
          </motion.button>
          
          <motion.button
            className="solve-button reset-button"
            onClick={resetPuzzle}
            disabled={isSolving}
            variants={buttonVariants}
            whileHover={!isSolving ? "hover" : undefined}
            whileTap={!isSolving ? "tap" : undefined}
          >
            Reset Puzzle
          </motion.button>
        </div>
        
        {(exploredNodes.length > 0 || isSolved) && (
          <div className="solution-stats">
            <div className="stat">
              <span className="stat-label">Nodes Explored</span>
              <span className="stat-value">{stats.nodesExplored}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Path Length</span>
              <span className="stat-value">{stats.pathLength - 1}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{stats.timeElapsed.toFixed(2)}s</span>
            </div>
          </div>
        )}
        
        <motion.button
          className="back-button"
          onClick={onBack}
          disabled={isSolving}
          variants={buttonVariants}
          whileHover={!isSolving ? "hover" : undefined}
          whileTap={!isSolving ? "tap" : undefined}
        >
          ← Back to Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AISolveMode;
