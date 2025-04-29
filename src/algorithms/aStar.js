
import { calculateManhattanDistance, hashPuzzle, isPuzzleSolved } from '../utils/puzzleUtils';

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift().element;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

class Node {
  constructor(state, parent = null, move = null, depth = 0, cost = 0) {
    this.state = state;
    this.parent = parent;
    this.move = move;
    this.depth = depth;
    this.cost = cost;
    this.hash = hashPuzzle(state);
  }
}

export const aStarSearch = (initialState, size, updateExploredNodes) => {
  const open = new PriorityQueue();
  const closed = new Set();
  
  // Create the initial node
  const initialNode = new Node(
    initialState,
    null,
    null,
    0,
    calculateManhattanDistance(initialState, size)
  );
  
  open.enqueue(initialNode, initialNode.cost + initialNode.depth);
  
  const exploredNodes = [initialNode];
  const exploredEdges = [];
  
  while (!open.isEmpty()) {
    // Get the node with the lowest f-score
    const currentNode = open.dequeue();
    
    // If we've already processed this state, skip it
    if (closed.has(currentNode.hash)) continue;
    
    // Add to closed set
    closed.add(currentNode.hash);
    
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
        
        // Skip if we've already processed this state
        if (closed.has(newHash)) continue;
        
        // Create the child node
        const childNode = new Node(
          newState,
          currentNode,
          move.direction,
          currentNode.depth + 1,
          calculateManhattanDistance(newState, size)
        );
        
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
        
        // Add to the open set
        open.enqueue(childNode, childNode.cost + childNode.depth);
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
