// @ts-nocheck
import { Graph, PriorityQueue, Edge, Node } from "@/lib/utils";
import { getOSRMRoute } from "@/lib/osrm-service";
import { DijkstraStep, DijkstraResult } from "@/lib/dijkstra";

/**
 * Enhanced Dijkstra that can use OSRM weights instead of straight-line distances
 */
export async function enhancedDijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId: string,
  useOSRM: boolean = false
): Promise<DijkstraResult> {
  console.log("🚀 Enhanced Dijkstra starting:", { startNodeId, endNodeId, useOSRM });
  
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
  let osrmCallsCount = 0;

  // Cache for OSRM results to avoid repeated calls
  const osrmCache = new Map<string, number>();
  const osrmRouteData = new Map<string, any>(); // Store full OSRM route data

  // Helper function to get edge weight
  const getEdgeWeight = async (edge: Edge, sourceNode: Node, targetNode: Node): Promise<number> => {
    if (!useOSRM) {
      return edge.weight; // Use original weight
    }

    // Create cache key
    const cacheKey = `${edge.source}-${edge.target}`;
    const reverseCacheKey = `${edge.target}-${edge.source}`;
    
    // Check cache first
    if (osrmCache.has(cacheKey)) {
      return osrmCache.get(cacheKey)!;
    }
    if (osrmCache.has(reverseCacheKey)) {
      return osrmCache.get(reverseCacheKey)!;
    }

    try {
      console.log(`🔍 Getting OSRM weight for ${sourceNode.name} -> ${targetNode.name}`);
      
      const osrmResult = await getOSRMRoute(
        sourceNode.latitude,
        sourceNode.longitude,
        targetNode.latitude,
        targetNode.longitude,
        "driving"
      );

      osrmCallsCount++;

      if (osrmResult) {
        // Convert OSRM duration (seconds) to minutes
        const osrmWeight = osrmResult.duration / 60;
        console.log(`✅ OSRM weight: ${osrmWeight.toFixed(2)} min (vs original: ${edge.weight} min)`);

        // Cache the result and store full OSRM data
        osrmCache.set(cacheKey, osrmWeight);
        osrmRouteData.set(cacheKey, osrmResult);
        return osrmWeight;
      } else {
        console.log(`❌ OSRM failed, using original weight: ${edge.weight} min`);
        // Fallback to original weight
        osrmCache.set(cacheKey, edge.weight);
        return edge.weight;
      }
    } catch (error) {
      console.error(`❌ OSRM error for ${sourceNode.name} -> ${targetNode.name}:`, error);
      // Fallback to original weight
      osrmCache.set(cacheKey, edge.weight);
      return edge.weight;
    }
  };

  // Create node lookup map
  const nodeMap = new Map<string, Node>();
  graph.nodes.forEach(node => nodeMap.set(node.id, node));

  // Set initial values
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previousNodes[node.id] = null;
  });

  // Distance to the start node is 0
  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);
  priorityQueueOperations++;

  console.log("🔄 Starting enhanced Dijkstra algorithm...");

  // Process nodes in priority order (closest first)
  while (!pq.isEmpty()) {
    const currentNodeId = pq.dequeue()!;
    priorityQueueOperations++;

    // Skip if already processed
    if (visitedNodes.includes(currentNodeId)) continue;

    // Mark as visited
    visitedNodes.push(currentNodeId);

    console.log(`📍 Processing node: ${nodeMap.get(currentNodeId)?.name || currentNodeId}`);

    // Record the current state as a step
    steps.push({
      currentNode: currentNodeId,
      visitedNodes: [...visitedNodes],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
    });

    // If we've reached our destination, we're done
    if (currentNodeId === endNodeId) {
      console.log("🎯 Reached destination!");
      break;
    }

    // Find all edges from the current node
    const edges = graph.edges.filter((edge) => edge.source === currentNodeId);
    console.log(`🔗 Found ${edges.length} edges from current node`);

    // Process each neighbor
    for (const edge of edges) {
      edgesProcessed++;
      const neighborId = edge.target;

      // Skip already visited nodes
      if (visitedNodes.includes(neighborId)) continue;

      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (!sourceNode || !targetNode) {
        console.warn(`⚠️ Missing node data for edge ${edge.source} -> ${edge.target}`);
        continue;
      }

      // Get edge weight (potentially from OSRM)
      const edgeWeight = await getEdgeWeight(edge, sourceNode, targetNode);

      // Calculate potential new distance
      const newDistance = distances[currentNodeId] + edgeWeight;

      // Update if we found a shorter path
      if (newDistance < distances[neighborId]) {
        console.log(`📈 Updated distance to ${targetNode.name}: ${newDistance.toFixed(2)} min`);
        distances[neighborId] = newDistance;
        previousNodes[neighborId] = currentNodeId;
        pq.enqueue(neighborId, newDistance);
        priorityQueueOperations++;
      }
    }
  }

  // Reconstruct the shortest path
  const path: string[] = [];
  const pathEdges: Edge[] = [];
  let current = endNodeId;

  while (current) {
    path.unshift(current);

    // If we have a previous node, find the edge between them
    const prev = previousNodes[current];
    if (prev) {
      const edge = graph.edges.find(
        (e) =>
          (e.source === prev && e.target === current) ||
          (e.source === current && e.target === prev)
      );
      if (edge) {
        pathEdges.unshift(edge);
      }
    }

    current = previousNodes[current] ?? "";
    if (!current) break;
  }

  // End measuring execution time
  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;

  console.log("✅ Enhanced Dijkstra completed:", {
    pathLength: path.length,
    totalDistance: distances[endNodeId],
    nodesExplored: visitedNodes.length,
    osrmCallsCount,
    executionTimeMs: executionTimeMs.toFixed(2)
  });

  // Estimate memory usage
  const memoryUsageEstimate =
    Object.keys(distances).length * 8 +
    Object.keys(previousNodes).length * 4 +
    visitedNodes.length * 4 +
    steps.length * 100 +
    priorityQueueOperations * 16 +
    (osrmCallsCount * 1024); // Add OSRM cache overhead

  return {
    path,
    distance: distances[endNodeId],
    steps,
    nodesExplored: visitedNodes.length,
    timeComplexity: useOSRM 
      ? "O((V + E) log V + E * OSRM_API_TIME) where OSRM calls add network latency"
      : "O((V + E) log V) where V is the number of vertices and E is the number of edges",
    spaceComplexity: useOSRM
      ? "O(V + OSRM_CACHE) for storing distances, previous nodes, priority queue, and OSRM cache"
      : "O(V) for storing distances, previous nodes, and priority queue",
    executionTimeMs,
    priorityQueueOperations,
    edgesProcessed,
    memoryUsageEstimate,
    edges: pathEdges,
    // Additional OSRM-specific metrics
    osrmCallsCount,
    osrmCacheSize: osrmCache.size,
    osrmRouteData: useOSRM ? osrmRouteData : null,
    routingMode: useOSRM ? "osrm-realistic" : "straight-line"
  };
}
