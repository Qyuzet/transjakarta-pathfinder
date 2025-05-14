// @ts-nocheck
import { Graph, PriorityQueue } from "@/lib/utils";

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
  executionTimeMs: number;
  priorityQueueOperations: number;
  edgesProcessed: number;
  memoryUsageEstimate: number;
};

export function dijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId: string
): DijkstraResult {
  // Start measuring execution time
  const startTime = performance.now();

  // Initialize data structures
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visitedNodes: string[] = [];
  const steps: DijkstraStep[] = [];
  const pq = new PriorityQueue<string>();

  // Metrics tracking
  let priorityQueueOperations = 0;
  let edgesProcessed = 0;

  // Set initial values
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previousNodes[node.id] = null;
  });

  // Distance to the start node is 0
  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);
  priorityQueueOperations++; // Count enqueue operation

  // Process nodes in priority order (closest first)
  while (!pq.isEmpty()) {
    const currentNodeId = pq.dequeue()!;
    priorityQueueOperations++; // Count dequeue operation

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
    const edges = graph.edges.filter((edge) => edge.source === currentNodeId);

    // Process each neighbor
    for (const edge of edges) {
      edgesProcessed++; // Count edge processing
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
        priorityQueueOperations++; // Count enqueue operation
      }
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
  // This is just an estimate based on the data structures used
  const memoryUsageEstimate =
    Object.keys(distances).length * 8 + // distances object (8 bytes per number)
    Object.keys(previousNodes).length * 4 + // previousNodes references
    visitedNodes.length * 4 + // visitedNodes array
    steps.length * 100 + // steps array (rough estimate)
    priorityQueueOperations * 16; // priority queue operations

  return {
    path,
    distance: distances[endNodeId],
    steps,
    nodesExplored: visitedNodes.length,
    // Add complexity analysis
    timeComplexity:
      "O((V + E) log V) where V is the number of vertices and E is the number of edges",
    spaceComplexity:
      "O(V) for storing distances, previous nodes, and priority queue",
    executionTimeMs,
    priorityQueueOperations,
    edgesProcessed,
    memoryUsageEstimate,
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
    executionTimeMs: result.executionTimeMs,
    priorityQueueOperations: result.priorityQueueOperations,
    edgesProcessed: result.edgesProcessed,
    memoryUsageEstimate: result.memoryUsageEstimate,
    operationsPerMs:
      result.priorityQueueOperations / (result.executionTimeMs || 1),
    efficiency: result.path.length / (result.nodesExplored || 1), // How efficient was the search (higher is better)
  };
}
