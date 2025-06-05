"use client";
// @ts-nocheck

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Image from "next/image";

export default function AlgorithmPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Pathfinding Algorithm Analysis
      </h1>

      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-green-800">New: OSRM Integration</h2>
        </div>
        <p className="text-green-700 text-sm">
          Our algorithms now integrate with OSRM (Open Source Routing Machine) for realistic road-based routing.
          Experience the difference between theoretical pathfinding and real-world navigation!
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="osrm">OSRM Integration</TabsTrigger>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pathfinding Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our route finder implements two fundamental pathfinding algorithms,
                  each with unique characteristics and use cases for finding optimal
                  routes in transportation networks.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-1">Dijkstra's Algorithm</h4>
                    <p className="text-sm text-red-700">
                      Finds the shortest path by weight (travel time). Uses a priority queue
                      to always process the node with minimum distance first.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Breadth-First Search (BFS)</h4>
                    <p className="text-sm text-blue-700">
                      Finds the path with fewest stations. Explores all neighbors
                      at the current depth before moving to the next level.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>OSRM Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We've enhanced our algorithms with OSRM (Open Source Routing Machine)
                  integration, providing realistic road-based routing instead of
                  theoretical straight-line distances.
                </p>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Real-World Routing</AlertTitle>
                  <AlertDescription>
                    OSRM provides actual road geometry, turn-by-turn instructions,
                    and realistic travel times based on real road networks.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">GPS-accurate route coordinates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Turn-by-turn navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Realistic travel distances</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Key Steps of the Algorithm
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Initialize distances of all vertices as infinite and
                      distance of source vertex as 0
                    </li>
                    <li>Create a set of all unvisited vertices</li>
                    <li>
                      While the set is not empty:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>
                          Select the vertex with minimum distance from the set
                        </li>
                        <li>Remove it from the unvisited set</li>
                        <li>Update distances of its adjacent vertices</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Pseudocode</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`function Dijkstra(Graph, source):
    dist[source] ← 0                   // Distance from source to source
    for each vertex v in Graph:        // Initialization
        if v ≠ source
            dist[v] ← INFINITY         // Unknown distance from source to v
            prev[v] ← UNDEFINED        // Previous node in optimal path from source
        end if
        add v to Q                     // All nodes initially in Q (unvisited nodes)
    end for

    while Q is not empty:
        u ← vertex in Q with min dist[u]   // Node with the least distance
        remove u from Q                     // Remove it from unvisited set

        for each neighbor v of u:           // Where v is still in Q.
            alt ← dist[u] + length(u, v)
            if alt < dist[v]:               // A shorter path to v has been found
                dist[v] ← alt
                prev[v] ← u
            end if
        end for
    end while

    return dist[], prev[]
end function`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History and Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Edsger W. Dijkstra conceived this algorithm in 1956 and
                published it in 1959. The algorithm was designed to find the
                shortest path between two cities in the Netherlands,
                conceptualized as a graph.
              </p>

              <p className="mt-4">
                Today, Dijkstra&apos;s algorithm is widely used in:
              </p>

              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>GPS navigation systems</li>
                <li>Network routing protocols</li>
                <li>Public transit systems</li>
                <li>Road networks and traffic management</li>
                <li>Robotics path planning</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dijkstra's Algorithm */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  Dijkstra's Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How it Works</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Initialize all distances to infinity, except start (0)</li>
                    <li>Add start node to priority queue</li>
                    <li>While queue not empty:</li>
                    <li className="ml-4">• Extract node with minimum distance</li>
                    <li className="ml-4">• Update distances to neighbors</li>
                    <li className="ml-4">• Add updated neighbors to queue</li>
                    <li>Stop when destination is reached</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Optimal:</strong> Always finds shortest path by weight</li>
                    <li>• <strong>Greedy:</strong> Makes locally optimal choices</li>
                    <li>• <strong>Priority Queue:</strong> Efficiently selects next node</li>
                    <li>• <strong>Early Termination:</strong> Stops at destination</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Best For</h4>
                  <p className="text-sm text-muted-foreground">
                    Finding routes with minimum travel time, considering traffic,
                    distance, and other weighted factors.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* BFS Algorithm */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Breadth-First Search (BFS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How it Works</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Initialize queue with start node</li>
                    <li>Mark start node as visited</li>
                    <li>While queue not empty:</li>
                    <li className="ml-4">• Dequeue front node</li>
                    <li className="ml-4">• Check if it's the destination</li>
                    <li className="ml-4">• Add unvisited neighbors to queue</li>
                    <li className="ml-4">• Mark neighbors as visited</li>
                    <li>Continue until destination found</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Unweighted:</strong> Treats all edges equally</li>
                    <li>• <strong>Level-by-level:</strong> Explores by distance from start</li>
                    <li>• <strong>FIFO Queue:</strong> First in, first out processing</li>
                    <li>• <strong>Complete:</strong> Always finds a solution if one exists</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Best For</h4>
                  <p className="text-sm text-muted-foreground">
                    Finding routes with minimum number of transfers or stations,
                    when all connections are considered equal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Aspect</th>
                      <th className="text-left p-2 text-red-600">Dijkstra's</th>
                      <th className="text-left p-2 text-blue-600">BFS</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    <tr className="border-b">
                      <td className="p-2 font-medium">Time Complexity</td>
                      <td className="p-2">O((V + E) log V)</td>
                      <td className="p-2">O(V + E)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Space Complexity</td>
                      <td className="p-2">O(V)</td>
                      <td className="p-2">O(V)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Optimizes For</td>
                      <td className="p-2">Minimum weight (time)</td>
                      <td className="p-2">Minimum hops (stations)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Data Structure</td>
                      <td className="p-2">Priority Queue</td>
                      <td className="p-2">FIFO Queue</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Use Case</td>
                      <td className="p-2">Fastest route</td>
                      <td className="p-2">Fewest transfers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="osrm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OSRM Integration Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                OSRM (Open Source Routing Machine) is a high-performance routing engine
                that provides realistic road-based routing. Our integration enhances
                traditional pathfinding algorithms with real-world road data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Traditional Mode</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Straight-line distances</li>
                    <li>• Theoretical calculations</li>
                    <li>• Fast computation</li>
                    <li>• Educational purposes</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">OSRM Mode</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Real road geometry</li>
                    <li>• Actual travel distances</li>
                    <li>• Turn-by-turn instructions</li>
                    <li>• Production-ready routing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enhanced Algorithm Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When OSRM mode is enabled, our Dijkstra's algorithm uses OSRM API calls
                to get realistic edge weights instead of straight-line distances.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How It Works</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Algorithm requests route between two stations</li>
                    <li>OSRM calculates realistic road-based route</li>
                    <li>Returns actual travel time and distance</li>
                    <li>Algorithm uses this data for edge weights</li>
                    <li>Results cached to avoid repeated API calls</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Realistic Results:</strong> Routes follow actual roads</li>
                    <li>• <strong>Accurate Timing:</strong> Real travel time estimates</li>
                    <li>• <strong>Turn Instructions:</strong> Step-by-step navigation</li>
                    <li>• <strong>Performance:</strong> Smart caching reduces API calls</li>
                  </ul>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Performance Note</AlertTitle>
                  <AlertDescription>
                    OSRM mode has higher latency due to API calls, but provides
                    significantly more accurate routing for real-world applications.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OSRM Features in Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">🗺️</div>
                  <h4 className="font-semibold mb-1">Route Geometry</h4>
                  <p className="text-xs text-muted-foreground">
                    GPS coordinates following actual road networks
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">🧭</div>
                  <h4 className="font-semibold mb-1">Turn Instructions</h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step navigation directions
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">⏱️</div>
                  <h4 className="font-semibold mb-1">Realistic Timing</h4>
                  <p className="text-xs text-muted-foreground">
                    Accurate travel time based on road conditions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Complexity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The time complexity of Dijkstra&apos;s algorithm depends on the
                data structures used for its implementation.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    Using an Array for Priority Queue
                  </h3>
                  <p className="text-muted-foreground">
                    O(V²) where V is the number of vertices
                  </p>
                  <p className="mt-1">
                    This approach is simpler but less efficient. We perform V
                    iterations, and in each iteration, we find the vertex with
                    the minimum distance value which takes O(V) time.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Using a Binary Heap Priority Queue
                  </h3>
                  <p className="text-muted-foreground">
                    O((V + E) log V) where V is the number of vertices and E is
                    the number of edges
                  </p>
                  <p className="mt-1">
                    The binary heap implementation improves efficiency by
                    reducing the time to find the next vertex to O(log V). Each
                    vertex is extracted once (O(V log V)), and each edge is
                    considered once (O(E log V)).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Using a Fibonacci Heap Priority Queue
                  </h3>
                  <p className="text-muted-foreground">
                    O(V log V + E) where V is the number of vertices and E is
                    the number of edges
                  </p>
                  <p className="mt-1">
                    This is the most efficient theoretical implementation,
                    though it&apos;s rarely used in practice due to its
                    complexity and high constant factors.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Our Implementation</h3>
                <p className="mt-1">
                  In our TransJakarta route finder, we use a binary heap
                  priority queue, which gives us a time complexity of O((V + E)
                  log V). For our network size, this provides excellent
                  performance while maintaining implementation simplicity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Space Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The space complexity of Dijkstra&apos;s algorithm is O(V), where
                V is the number of vertices. This accounts for:
              </p>

              <ul className="list-disc list-inside mt-4 space-y-1">
                <li>The distances array: O(V)</li>
                <li>The previous nodes array: O(V)</li>
                <li>The priority queue: O(V)</li>
              </ul>

              <p className="mt-4">
                Our implementation uses additional space to store the algorithm
                steps for visualization purposes. This increases the space
                complexity but enhances the educational value of the
                application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimality</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dijkstra&apos;s algorithm guarantees the optimal (shortest) path
                when all edge weights are non-negative. The proof relies on the
                property that once a node is visited, we have found the shortest
                path to it.
              </p>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Limitation</AlertTitle>
                <AlertDescription>
                  Dijkstra&apos;s algorithm does not work correctly if there are
                  negative edge weights, as it may choose a path with a lower
                  current cost but miss a better path due to future negative
                  edges. For graphs with negative edges, the Bellman-Ford
                  algorithm should be used instead.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                In our TransJakarta route finder, we&apos;ve implemented
                Dijkstra&apos;s algorithm with the following components:
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Data Structures</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Graph:</strong> Represented as a collection of
                      nodes and edges
                    </li>
                    <li>
                      <strong>Priority Queue:</strong> Using a binary heap
                      implementation for efficiency
                    </li>
                    <li>
                      <strong>Distance Map:</strong> Stores the current shortest
                      distance to each node
                    </li>
                    <li>
                      <strong>Previous Nodes Map:</strong> Tracks the optimal
                      path for reconstruction
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Algorithm Steps</h3>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      Initialize all distances as infinity except the source
                      (which is 0)
                    </li>
                    <li>Add the source node to the priority queue</li>
                    <li>
                      While the priority queue is not empty:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Extract the node with the minimum distance</li>
                        <li>
                          For each neighbor, calculate a potential new distance
                        </li>
                        <li>
                          If the new distance is better, update the distance and
                          previous node
                        </li>
                      </ul>
                    </li>
                    <li>Reconstruct the path using the previous nodes map</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Visualization Features
                  </h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Step-by-step recording of algorithm progress</li>
                    <li>
                      Node coloring to show current, visited, and path nodes
                    </li>
                    <li>
                      Interactive controls to play, pause, and step through the
                      algorithm
                    </li>
                    <li>Metrics display to show performance statistics</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Code Excerpt</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`export function dijkstra(
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
    timeComplexity: "O((V + E) log V) where V is the number of vertices and E is the number of edges",
    spaceComplexity: "O(V) for storing distances, previous nodes, and priority queue",
  };
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-World Transportation Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our route finder demonstrates practical applications of pathfinding
                algorithms in public transportation, enhanced with real-world routing
                capabilities through OSRM integration.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Multi-Modal Graph Representation</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Nodes:</strong> Stations from TransJakarta, MRT, LRT, KRL, and JakLingko
                    </li>
                    <li>
                      <strong>Edges:</strong> Direct connections between stations
                    </li>
                    <li>
                      <strong>Weights:</strong> Travel time (traditional) or OSRM-calculated distances
                    </li>
                    <li>
                      <strong>Attributes:</strong> Transport mode, corridor info, station types
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Routing Modes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-blue-600 mb-2">Straight-Line Mode</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Theoretical shortest path</li>
                        <li>• Fast computation</li>
                        <li>• Educational demonstration</li>
                        <li>• Algorithm comparison</li>
                      </ul>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-green-600 mb-2">OSRM Realistic Mode</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Real road-based routing</li>
                        <li>• Accurate travel times</li>
                        <li>• Turn-by-turn instructions</li>
                        <li>• Production-ready results</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Weight Calculation</h3>
                  <p className="mt-1">
                    Edge weights (travel times) are calculated using:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      Physical distance between stations (using Haversine
                      formula)
                    </li>
                    <li>
                      Estimated bus speed (assuming 2 minutes per kilometer)
                    </li>
                    <li>Station stop time (adding 1 minute per station)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Real-world Considerations
                  </h3>
                  <p className="mt-1">
                    In a production application, edge weights would incorporate
                    additional factors:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Historical traffic data</li>
                    <li>Time of day (rush hour vs. off-peak)</li>
                    <li>Bus frequency and waiting times</li>
                    <li>Construction or route disruptions</li>
                    <li>Bus capacity and crowding</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Educational Note</AlertTitle>
                <AlertDescription>
                  This implementation is simplified for educational purposes. A
                  commercial routing system would utilize real-time data, more
                  sophisticated cost modeling, and potentially multi-criteria
                  optimization.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extending the Algorithm</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dijkstra&apos;s algorithm can be extended in several ways to
                improve its applicability to real-world transit routing:
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    Multi-criteria Optimization
                  </h3>
                  <p className="mt-1">
                    Incorporating multiple factors in path selection:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Time (fastest route)</li>
                    <li>Distance (shortest route)</li>
                    <li>Transfers (fewest changes)</li>
                    <li>Cost (cheapest fare)</li>
                    <li>Comfort (least crowded)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Time-dependent Routing
                  </h3>
                  <p className="mt-1">
                    Edge weights can vary based on the time of day:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Rush hour traffic patterns</li>
                    <li>Bus schedules and frequencies</li>
                    <li>Wait times at transit connections</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">A* Algorithm</h3>
                  <p className="mt-1">
                    An extension of Dijkstra that uses heuristics to speed up
                    the search:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      Uses a heuristic function to estimate the distance to the
                      goal
                    </li>
                    <li>
                      Prioritizes paths that seem to lead toward the destination
                    </li>
                    <li>
                      Can significantly reduce computation time for large
                      networks
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Current Features & Future Enhancements</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Currently Available</h4>
                    <ul className="text-sm space-y-1">
                      <li>• OSRM realistic road routing</li>
                      <li>• Multi-modal transport integration</li>
                      <li>• Algorithm comparison tools</li>
                      <li>• Interactive visualization</li>
                      <li>• Turn-by-turn navigation</li>
                      <li>• Performance metrics analysis</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">🚀 Future Enhancements</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Real-time traffic integration</li>
                      <li>• Live public transport data</li>
                      <li>• Walking route optimization</li>
                      <li>• Multiple routing profiles</li>
                      <li>• Accessibility options</li>
                      <li>• Route alternatives</li>
                      <li>• Offline routing support</li>
                      <li>• Custom user preferences</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Try It Now!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Experience the difference between theoretical algorithms and real-world routing:
                </p>
                <div className="space-y-2 text-sm">
                  <div>1. Go to <strong>Route Finder</strong> in the navigation</div>
                  <div>2. Select start and end stations</div>
                  <div>3. Choose between <strong>Straight Line</strong> and <strong>Realistic Roads (OSRM)</strong></div>
                  <div>4. Compare algorithm results with real routing data</div>
                  <div>5. Explore the <strong>Algorithm Visualization</strong> tab for detailed analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
