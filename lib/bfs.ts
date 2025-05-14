import { Graph } from "@/lib/utils";

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
  executionTimeMs: number;
  queueOperations: number;
  edgesProcessed: number;
  memoryUsageEstimate: number;
};

export function bfs(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): BFSResult {
  // Start measuring execution time
  const startTime = performance.now();

  // Initialize data structures
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visitedNodes: string[] = [];
  const steps: BFSStep[] = [];
  const queue: string[] = [];

  // Metrics tracking
  let queueOperations = 0;
  let edgesProcessed = 0;

  // Set initial values
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previousNodes[node.id] = null;
  });

  // Distance to the start node is 0
  distances[startNodeId] = 0;
  queue.push(startNodeId);
  queueOperations++; // Count queue push operation
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
    queueOperations++; // Count queue shift operation

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
    const edges = graph.edges.filter((edge) => edge.source === currentNodeId);

    // Process each neighbor
    for (const edge of edges) {
      edgesProcessed++; // Count edge processing
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
      queueOperations++; // Count queue push operation
    }
  }

  // Reconstruct the shortest path
  const path: string[] = [];
  let current = endNodeId;

  while (current) {
    path.unshift(current);
    current = previousNodes[current] ?? "";
    if (!current) break;
  }

  // End measuring execution time
  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;

  // Estimate memory usage (very rough approximation)
  const memoryUsageEstimate =
    Object.keys(distances).length * 8 + // distances object (8 bytes per number)
    Object.keys(previousNodes).length * 4 + // previousNodes references
    visitedNodes.length * 4 + // visitedNodes array
    steps.length * 120 + // steps array (rough estimate, BFS steps include queue)
    queueOperations * 8; // queue operations

  return {
    path,
    distance: distances[endNodeId],
    steps,
    nodesExplored: visitedNodes.length,
    // Add complexity analysis
    timeComplexity:
      "O(V + E) where V is the number of vertices and E is the number of edges",
    spaceComplexity:
      "O(V) for storing distances, previous nodes, and the queue",
    executionTimeMs,
    queueOperations,
    edgesProcessed,
    memoryUsageEstimate,
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
    executionTimeMs: result.executionTimeMs,
    queueOperations: result.queueOperations,
    edgesProcessed: result.edgesProcessed,
    memoryUsageEstimate: result.memoryUsageEstimate,
    operationsPerMs: result.queueOperations / (result.executionTimeMs || 1),
    efficiency: result.path.length / (result.nodesExplored || 1), // How efficient was the search (higher is better)
  };
}
