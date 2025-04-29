
// Generate a random puzzle by performing random moves from the solved state
export const generateRandomPuzzle = (size) => {
  // Create a solved puzzle first
  const solvedPuzzle = Array.from({ length: size * size }, (_, index) => 
    index === size * size - 1 ? 0 : index + 1
  );
  
  // Make a deep copy
  let puzzle = [...solvedPuzzle];
  
  // Perform random moves
  const numMoves = size * size * 20; // More moves for larger puzzles
  
  for (let i = 0; i < numMoves; i++) {
    const emptyIndex = puzzle.findIndex(tile => tile === 0);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    // Find possible moves
    const possibleMoves = [];
    
    // Up
    if (emptyRow > 0) {
      possibleMoves.push(emptyIndex - size);
    }
    // Down
    if (emptyRow < size - 1) {
      possibleMoves.push(emptyIndex + size);
    }
    // Left
    if (emptyCol > 0) {
      possibleMoves.push(emptyIndex - 1);
    }
    // Right
    if (emptyCol < size - 1) {
      possibleMoves.push(emptyIndex + 1);
    }
    
    // Select a random move
    const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
    // Make the move
    puzzle[emptyIndex] = puzzle[moveIndex];
    puzzle[moveIndex] = 0;
  }
  
  // Make sure the puzzle is solvable
  if (!isSolvable(puzzle, size)) {
    // If not solvable, swap two tiles to make it solvable
    // (but not the empty tile)
    let index1 = 0;
    let index2 = 1;
    
    // Find two non-empty tiles
    while (puzzle[index1] === 0) index1++;
    index2 = index1 + 1;
    while (index2 < puzzle.length && puzzle[index2] === 0) index2++;
    
    // Swap them
    [puzzle[index1], puzzle[index2]] = [puzzle[index2], puzzle[index1]];
  }
  
  return puzzle;
};

// Check if the puzzle is solved
export const isPuzzleSolved = (puzzle, size) => {
  for (let i = 0; i < puzzle.length - 1; i++) {
    if (puzzle[i] !== i + 1) return false;
  }
  return puzzle[puzzle.length - 1] === 0;
};

// Check if a puzzle is solvable
export const isSolvable = (puzzle, size) => {
  // Count inversions
  let inversions = 0;
  
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] === 0) continue;
    
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[j] === 0) continue;
      
      if (puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  
  // For odd grid sizes, the puzzle is solvable if the number of inversions is even
  if (size % 2 === 1) {
    return inversions % 2 === 0;
  }
  // For even grid sizes, the puzzle is solvable if:
  // - the empty tile is on an even row (from the bottom) and the number of inversions is odd
  // - the empty tile is on an odd row (from the bottom) and the number of inversions is even
  else {
    const emptyIndex = puzzle.findIndex(tile => tile === 0);
    const emptyRow = Math.floor(emptyIndex / size);
    const rowFromBottom = size - emptyRow;
    
    if (rowFromBottom % 2 === 0) {
      return inversions % 2 === 1;
    } else {
      return inversions % 2 === 0;
    }
  }
};

// Get the goal state
export const getGoalState = (size) => {
  return Array.from({ length: size * size }, (_, index) => 
    index === size * size - 1 ? 0 : index + 1
  );
};

// Calculate Manhattan distance between current state and goal state
export const calculateManhattanDistance = (puzzle, size) => {
  let distance = 0;
  
  for (let i = 0; i < puzzle.length; i++) {
    const value = puzzle[i];
    if (value === 0) continue;
    
    // Calculate the position where this value should be in the goal state
    const goalIndex = value - 1;
    const goalRow = Math.floor(goalIndex / size);
    const goalCol = goalIndex % size;
    
    // Calculate the current position
    const currentRow = Math.floor(i / size);
    const currentCol = i % size;
    
    // Add Manhattan distance
    distance += Math.abs(goalRow - currentRow) + Math.abs(goalCol - currentCol);
  }
  
  return distance;
};

// Hash a puzzle state to use as a key
export const hashPuzzle = (puzzle) => {
  return puzzle.join(',');
};
