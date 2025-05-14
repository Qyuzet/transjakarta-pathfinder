import { Graph } from '@/lib/utils';

export type BFSStep = {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  queue: string[];
};

export type BFSResult = {
  path: string[];
  distance: number;
  steps: BFSStep[];
  nodesExplored: number;
  timeComplexity: string;
  spaceComplexity: string;
};

export function bfs(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): BFSResult {
  // Initialize data structures
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visitedNodes: string[] = [];
  const steps: BFSStep[] = [];
  const queue: string[] = [];

  // Set initial values
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previousNodes[node.id] = null;
  });

  // Distance to the start node is 0
  distances[startNodeId] = 0;
  queue.push(startNodeId);
  visitedNodes.push(startNodeId);

  // Record initial state
  steps.push({
    currentNode: startNodeId,
    visitedNodes: [...visitedNodes],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
    queue: [...queue],
  });

  // Process nodes in FIFO order
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    // Record the current state as a step
    steps.push({
      currentNode: currentNodeId,
      visitedNodes: [...visitedNodes],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
      queue: [...queue],
    });

    // If we've reached our destination, we're done
    if (currentNodeId === endNodeId) break;

    // Find all edges from the current node
    const edges = graph.edges.filter(edge => edge.source === currentNodeId);
    
    // Process each neighbor
    for (const edge of edges) {
      const neighborId = edge.target;
      
      // Skip already visited nodes
      if (visitedNodes.includes(neighborId)) continue;
      
      // Mark as visited
      visitedNodes.push(neighborId);
      
      // Calculate distance (in BFS, it's just parent's distance + 1 for unweighted graphs)
      // For weighted graphs like this one, we'll use the edge weight like Dijkstra
      const newDistance = distances[currentNodeId] + edge.weight;
      
      // Update distance and previous node
      distances[neighborId] = newDistance;
      previousNodes[neighborId] = currentNodeId;
      
      // Add to queue for processing
      queue.push(neighborId);
    }
  }

  // Reconstruct the shortest path
  const path: string[] = [];
  let current = endNodeId;
  
  while (current) {
    path.unshift(current);
    current = previousNodes[current] ?? '';
    if (!current) break;
  }

  return {
    path,
    distance: distances[endNodeId],
    steps,
    nodesExplored: visitedNodes.length,
    // Add complexity analysis
    timeComplexity: "O(V + E) where V is the number of vertices and E is the number of edges",
    spaceComplexity: "O(V) for storing distances, previous nodes, and the queue",
  };
}

// Function to get all algorithmic operations for educational display
export function getAlgorithmMetrics(result: BFSResult) {
  return {
    nodesExplored: result.nodesExplored,
    pathLength: result.path.length,
    totalSteps: result.steps.length,
    finalDistance: result.distance,
    timeComplexity: result.timeComplexity,
    spaceComplexity: result.spaceComplexity,
  };
}
