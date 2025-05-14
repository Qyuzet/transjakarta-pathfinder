import { Graph, PriorityQueue } from '@/lib/utils';

export type DijkstraStep = {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
};

export type DijkstraResult = {
  path: string[];
  distance: number;
  steps: DijkstraStep[];
  nodesExplored: number;
  timeComplexity: string;
  spaceComplexity: string;
};

export function dijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): DijkstraResult {
  // Initialize data structures
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visitedNodes: string[] = [];
  const steps: DijkstraStep[] = [];
  const pq = new PriorityQueue<string>();

  // Set initial values
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previousNodes[node.id] = null;
  });

  // Distance to the start node is 0
  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);

  // Process nodes in priority order (closest first)
  while (!pq.isEmpty()) {
    const currentNodeId = pq.dequeue()!;
    
    // Skip if already processed
    if (visitedNodes.includes(currentNodeId)) continue;
    
    // Mark as visited
    visitedNodes.push(currentNodeId);
    
    // Record the current state as a step
    steps.push({
      currentNode: currentNodeId,
      visitedNodes: [...visitedNodes],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
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
      
      // Calculate potential new distance
      const newDistance = distances[currentNodeId] + edge.weight;
      
      // Update if we found a shorter path
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previousNodes[neighborId] = currentNodeId;
        pq.enqueue(neighborId, newDistance);
      }
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
    timeComplexity: "O((V + E) log V) where V is the number of vertices and E is the number of edges",
    spaceComplexity: "O(V) for storing distances, previous nodes, and priority queue",
  };
}

// Function to get all algorithmic operations for educational display
export function getAlgorithmMetrics(result: DijkstraResult) {
  return {
    nodesExplored: result.nodesExplored,
    pathLength: result.path.length,
    totalSteps: result.steps.length,
    finalDistance: result.distance,
    timeComplexity: result.timeComplexity,
    spaceComplexity: result.spaceComplexity,
  };
}