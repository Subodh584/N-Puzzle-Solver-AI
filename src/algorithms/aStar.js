
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
    
    const currentNode = open.dequeue();
    
    if (closed.has(currentNode.hash)) continue;
    
    closed.add(currentNode.hash);
    
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
    const emptyIndex = currentNode.state.findIndex(tile => tile === 0);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    const moves = [
      { direction: 'up', rowDiff: -1, colDiff: 0 },
      { direction: 'down', rowDiff: 1, colDiff: 0 },
      { direction: 'left', rowDiff: 0, colDiff: -1 },
      { direction: 'right', rowDiff: 0, colDiff: 1 }
    ];
    
    for (const move of moves) {
      const newRow = emptyRow + move.rowDiff;
      const newCol = emptyCol + move.colDiff;
      
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        const newEmptyIndex = newRow * size + newCol;
        
        const newState = [...currentNode.state];
        newState[emptyIndex] = newState[newEmptyIndex];
        newState[newEmptyIndex] = 0;
        
        const newHash = hashPuzzle(newState);
        
        if (closed.has(newHash)) continue;
        
        const childNode = new Node(
          newState,
          currentNode,
          move.direction,
          currentNode.depth + 1,
          calculateManhattanDistance(newState, size)
        );
        
        exploredNodes.push(childNode);
        exploredEdges.push({
          source: currentNode.hash,
          target: childNode.hash
        });
        
        if (exploredNodes.length % 20 === 0) {
          updateExploredNodes(exploredNodes, exploredEdges);
        }
        
        open.enqueue(childNode, childNode.cost + childNode.depth);
      }
    }
  }
  
  return {
    path: [],
    exploredNodes,
    exploredEdges
  };
};
