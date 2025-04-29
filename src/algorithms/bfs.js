
import { hashPuzzle, isPuzzleSolved } from '../utils/puzzleUtils';

class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

class Node {
  constructor(state, parent = null, move = null, depth = 0) {
    this.state = state;
    this.parent = parent;
    this.move = move;
    this.depth = depth;
    this.hash = hashPuzzle(state);
  }
}

export const bfsSearch = (initialState, size, updateExploredNodes) => {
  const queue = new Queue();
  const visited = new Set();
  
  // Create the initial node
  const initialNode = new Node(initialState);
  
  queue.enqueue(initialNode);
  visited.add(initialNode.hash);
  
  const exploredNodes = [initialNode];
  const exploredEdges = [];
  
  while (!queue.isEmpty()) {
    // Get the next node from the queue
    const currentNode = queue.dequeue();
    
    // Check if we've reached the goal
    if (isPuzzleSolved(currentNode.state, size)) {
      // Build the path
      const path = [];
      let node = currentNode;
      
      while (node) {
        path.unshift(node.state);
        node = node.parent;
      }
      
      return {
        path,
        exploredNodes,
        exploredEdges
      };
    }
    
    // Expand the node by generating all possible moves
    const emptyIndex = currentNode.state.findIndex(tile => tile === 0);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    // Try each possible move: up, down, left, right
    const moves = [
      { direction: 'up', rowDiff: -1, colDiff: 0 },
      { direction: 'down', rowDiff: 1, colDiff: 0 },
      { direction: 'left', rowDiff: 0, colDiff: -1 },
      { direction: 'right', rowDiff: 0, colDiff: 1 }
    ];
    
    for (const move of moves) {
      const newRow = emptyRow + move.rowDiff;
      const newCol = emptyCol + move.colDiff;
      
      // Check if the move is valid
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        const newEmptyIndex = newRow * size + newCol;
        
        // Create the new state by swapping the empty tile
        const newState = [...currentNode.state];
        newState[emptyIndex] = newState[newEmptyIndex];
        newState[newEmptyIndex] = 0;
        
        const newHash = hashPuzzle(newState);
        
        // Skip if we've already visited this state
        if (visited.has(newHash)) continue;
        
        // Create the child node
        const childNode = new Node(
          newState,
          currentNode,
          move.direction,
          currentNode.depth + 1
        );
        
        // Add to the visited set
        visited.add(newHash);
        
        // Add to the explored nodes and edges
        exploredNodes.push(childNode);
        exploredEdges.push({
          source: currentNode.hash,
          target: childNode.hash
        });
        
        // Update the graph visualization periodically
        if (exploredNodes.length % 20 === 0) {
          updateExploredNodes(exploredNodes, exploredEdges);
        }
        
        // Add to the queue
        queue.enqueue(childNode);
      }
    }
  }
  
  // If we get here, there's no solution
  return {
    path: [],
    exploredNodes,
    exploredEdges
  };
};
