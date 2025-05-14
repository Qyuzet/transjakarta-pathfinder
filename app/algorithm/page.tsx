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
        Dijkstra&apos;s Algorithm Analysis
      </h1>

      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complexity">Complexity Analysis</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="application">Real-world Application</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Dijkstra&apos;s Algorithm?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dijkstra&apos;s algorithm is a graph search algorithm that
                solves the single-source shortest path problem for a graph with
                non-negative edge weights, producing a shortest-path tree. This
                algorithm is often used in routing and navigation systems.
              </p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Key Insight</AlertTitle>
                <AlertDescription>
                  Dijkstra&apos;s algorithm uses a greedy approach, always
                  choosing the next node with the smallest known distance from
                  the starting point.
                </AlertDescription>
              </Alert>

              <div className="my-6">
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

              <div className="mt-6">
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
              <CardTitle>TransJakarta Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For our TransJakarta route finder, we&apos;ve applied
                Dijkstra&apos;s algorithm to find the most cost-efficient bus
                routes. Here&apos;s how the algorithm is applied in this
                context:
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Graph Representation</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Nodes:</strong> TransJakarta stations with
                      geographical coordinates
                    </li>
                    <li>
                      <strong>Edges:</strong> Bus routes between stations
                    </li>
                    <li>
                      <strong>Weights:</strong> Estimated travel time in minutes
                    </li>
                  </ul>
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
                <h3 className="text-lg font-medium">Future Enhancements</h3>
                <p className="mt-1">
                  Potential improvements to our TransJakarta route finder
                  include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Integration with real-time TransJakarta bus data</li>
                  <li>Incorporation of traffic conditions and delays</li>
                  <li>
                    Support for multi-modal routing (bus + train + walking)
                  </li>
                  <li>User preferences for route optimization</li>
                  <li>
                    Accessibility options for passengers with mobility needs
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
