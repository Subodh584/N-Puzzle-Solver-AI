
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
  
  const initialNode = new Node(initialState);
  
  queue.enqueue(initialNode);
  visited.add(initialNode.hash);
  
  const exploredNodes = [initialNode];
  const exploredEdges = [];
  
  while (!queue.isEmpty()) {

    const currentNode = queue.dequeue();
    
    if (isPuzzleSolved(currentNode.state, size)) {
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
        
        if (visited.has(newHash)) continue;

        const childNode = new Node(
          newState,
          currentNode,
          move.direction,
          currentNode.depth + 1
        );
        
        visited.add(newHash);
        
        exploredNodes.push(childNode);
        exploredEdges.push({
          source: currentNode.hash,
          target: childNode.hash
        });
        
        if (exploredNodes.length % 20 === 0) {
          updateExploredNodes(exploredNodes, exploredEdges);
        }
        
        queue.enqueue(childNode);
      }
    }
  }
  
  return {
    path: [],
    exploredNodes,
    exploredEdges
  };
};
