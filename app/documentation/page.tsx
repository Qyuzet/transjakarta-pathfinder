import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Info } from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Project Documentation</h1>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Implementation</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This project is an educational platform that demonstrates the application of 
                Dijkstra&apos;s algorithm for finding the most cost-efficient bus routes on the 
                TransJakarta network in Jakarta, Indonesia. It was developed as an assignment 
                for the Algorithm Design and Analysis subject.
              </p>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Interactive visualization of the TransJakarta bus network using real geographical data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Implementation of Dijkstra&apos;s algorithm for optimal path finding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Step-by-step algorithm visualization to understand how Dijkstra works</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Performance metrics and complexity analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Comprehensive documentation about the algorithm and its application</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Educational Goals</h3>
                <p>
                  This project aims to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Demonstrate how graph algorithms work in real-world scenarios</li>
                  <li>Visualize the step-by-step execution of Dijkstra&apos;s algorithm</li>
                  <li>Analyze the algorithm&apos;s performance and complexity</li>
                  <li>Show the practical application of algorithms in transportation systems</li>
                  <li>Provide an interactive learning tool for algorithm education</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The project is organized into several key components:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Core Modules</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Route Finder:</strong> The main interface for selecting stations and finding optimal routes</li>
                    <li><strong>Map Visualization:</strong> Displays the TransJakarta network and routes on a geographic map</li>
                    <li><strong>Algorithm Visualization:</strong> Shows step-by-step execution of Dijkstra&apos;s algorithm</li>
                    <li><strong>Performance Metrics:</strong> Displays statistics about the algorithm&apos;s execution</li>
                    <li><strong>Documentation:</strong> Comprehensive information about the algorithm and the project</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Technologies Used</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Next.js:</strong> React framework for the application</li>
                    <li><strong>React:</strong> Library for building user interfaces</li>
                    <li><strong>Leaflet:</strong> Map visualization library</li>
                    <li><strong>Recharts:</strong> Charting library for data visualization</li>
                    <li><strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                    <li><strong>shadcn/ui:</strong> Component library based on Radix UI</li>
                    <li><strong>TypeScript:</strong> Type-safe JavaScript</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The project follows a component-based architecture using React and Next.js. 
                Here&apos;s a breakdown of the key components and their responsibilities:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Frontend Components</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>RouteFinder:</strong> Main component for station selection and route calculation</li>
                    <li><strong>InteractiveMap:</strong> Map display using Leaflet for geographic visualization</li>
                    <li><strong>AnimatedAlgorithmSteps:</strong> Visualization of Dijkstra algorithm execution</li>
                    <li><strong>AlgorithmMetrics:</strong> Display of performance statistics</li>
                    <li><strong>Documentation Pages:</strong> Information about the project and algorithm</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Core Logic</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Graph Data Structure:</strong> Representation of the TransJakarta network</li>
                    <li><strong>Dijkstra Algorithm:</strong> Implementation for finding shortest paths</li>
                    <li><strong>Priority Queue:</strong> Efficient data structure for the algorithm</li>
                    <li><strong>Geographical Calculations:</strong> Distance calculation between stations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Data Management</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Static TransJakarta Data:</strong> Simplified representation of stations and routes</li>
                    <li><strong>Algorithm Step Recording:</strong> Capture of intermediate states for visualization</li>
                    <li><strong>Route Path Storage:</strong> Storage of calculated optimal paths</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium">File Structure</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`project/
├── app/
│   ├── algorithm/       # Algorithm analysis page
│   ├── documentation/   # Project documentation page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page with route finder
├── components/
│   ├── algorithm/
│   │   ├── metrics.tsx        # Performance metrics component
│   │   ├── route-finder.tsx   # Main route finder component
│   │   └── visualization.tsx  # Algorithm visualization component
│   ├── layout/
│   │   └── navbar.tsx          # Navigation bar component
│   ├── map/
│   │   └── interactive-map.tsx # Map visualization component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── data/
│   │   └── transjakarta-routes.ts  # TransJakarta network data
│   ├── dijkstra.ts                # Dijkstra algorithm implementation
│   └── utils.ts                   # Utility functions and types
└── public/
    └── ...                         # Static assets`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The application uses the following data structures to represent the TransJakarta network:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Node (Station)</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`type Node = {
  id: string;       // Unique identifier
  name: string;     // Station name
  latitude: number; // Geographic coordinates
  longitude: number;
};`}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Edge (Route)</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`type Edge = {
  source: string;  // Source station ID
  target: string;  // Target station ID
  weight: number;  // Travel time in minutes
  distance: number; // Physical distance in kilometers
};`}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Graph (Network)</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`type Graph = {
  nodes: Node[];  // All stations
  edges: Edge[];  // All routes
};`}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Algorithm Steps</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`type DijkstraStep = {
  currentNode: string;  // Currently processed node
  visitedNodes: string[];  // All visited nodes so far
  distances: Record<string, number>;  // Current distances
  previousNodes: Record<string, string | null>;  // Path tracking
};`}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Algorithm Result</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`type DijkstraResult = {
  path: string[];  // Optimal path (station IDs)
  distance: number;  // Total travel time
  steps: DijkstraStep[];  // All algorithm steps
  nodesExplored: number;  // Total nodes processed
  timeComplexity: string;  // Time complexity info
  spaceComplexity: string;  // Space complexity info
};`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="algorithm" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dijkstra&apos;s Algorithm Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our implementation of Dijkstra&apos;s algorithm is specifically tailored for the TransJakarta 
                network. Here are the key aspects of the implementation:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Priority Queue Implementation</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`export class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}`}</code>
                  </pre>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For simplicity, we use a basic priority queue implementation with array sorting.
                    In a production system, a more efficient implementation like a binary heap would
                    be preferable for large networks.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Core Algorithm</h3>
                  <p className="mt-1">
                    The main steps of our Dijkstra implementation:
                  </p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Initialize distances (all to Infinity except source node to 0)</li>
                    <li>Initialize a priority queue with the source node</li>
                    <li>While the queue is not empty:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Extract the node with the minimum distance</li>
                        <li>If it&apos;s the destination, we&apos;re done</li>
                        <li>For each neighboring node, calculate a potential new distance</li>
                        <li>If the new distance is better, update the distance and add to queue</li>
                      </ul>
                    </li>
                    <li>Reconstruct the path using the previous nodes</li>
                    <li>Return the result with path, distance, and steps for visualization</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Step Recording for Visualization</h3>
                  <p className="mt-1">
                    A unique aspect of our implementation is the recording of each algorithm step
                    for educational visualization:
                  </p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                    <code>{`// Record the current state as a step
steps.push({
  currentNode: currentNodeId,
  visitedNodes: [...visitedNodes],
  distances: { ...distances },
  previousNodes: { ...previousNodes },
});`}</code>
                  </pre>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This allows us to replay the algorithm execution and show how Dijkstra
                    progressively explores the graph to find the optimal path.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium">Edge Weight Calculation</h3>
                <p className="mt-1">
                  Edge weights (travel times) are calculated based on the geographic distance
                  between stations:
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`function createEdge(sourceId: string, targetId: string): Edge {
  const sourceNode = stations.find(node => node.id === sourceId)!;
  const targetNode = stations.find(node => node.id === targetId)!;
  
  const distance = calculateDistance(
    sourceNode.latitude, sourceNode.longitude,
    targetNode.latitude, targetNode.longitude
  );
  
  // Estimate travel time: assume 2 minutes per km + 1 minute for station stop
  const weight = Math.round(distance * 2) + 1;
  
  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
  };
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The algorithm visualization component is a key educational feature of this project.
                It shows step-by-step how Dijkstra&apos;s algorithm explores the graph:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Node Visualization</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Unvisited nodes:</strong> Shown in light gray</li>
                    <li><strong>Visited nodes:</strong> Shown in blue</li>
                    <li><strong>Current node:</strong> Shown in orange (actively being processed)</li>
                    <li><strong>Path nodes:</strong> Shown in green (final shortest path)</li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Each node displays its ID, name, and current distance value, allowing users
                    to see how distances are updated during algorithm execution.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Interactive Controls</h3>
                  <p className="mt-1">
                    The visualization provides controls to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Play/pause the algorithm execution</li>
                    <li>Step forward/backward through the algorithm steps</li>
                    <li>Reset to the beginning</li>
                    <li>Adjust playback speed (slow, normal, fast)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Detailed Node Information</h3>
                  <p className="mt-1">
                    For each node, the visualization shows:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Current distance from the source</li>
                    <li>Previous node in the shortest path</li>
                    <li>Visitation status</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <p className="mt-1">
                  The metrics component displays:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Number of nodes explored</li>
                  <li>Length of the shortest path</li>
                  <li>Total algorithm steps</li>
                  <li>Time and space complexity analysis</li>
                  <li>Visual charts comparing key metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Using the Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This guide explains how to use the TransJakarta Route Finder application:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Finding a Route</h3>
                  <ol className="list-decimal list-inside mt-2 space-y-2">
                    <li>Navigate to the <strong>Route Finder</strong> page (home page)</li>
                    <li>Select a <strong>Start Station</strong> from the dropdown menu</li>
                    <li>Select an <strong>End Station</strong> from the dropdown menu</li>
                    <li>Click the <strong>Find Optimal Route</strong> button</li>
                    <li>View the results on the map and in the Route Details panel</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Viewing the Map</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>The map shows all TransJakarta stations as markers</li>
                    <li>When a route is found, the optimal path is highlighted</li>
                    <li>The start station is marked with an &apos;A&apos; icon</li>
                    <li>The end station is marked with a &apos;B&apos; icon</li>
                    <li>You can zoom and pan the map for better viewing</li>
                    <li>Click on any station marker to see its details</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Algorithm Visualization</h3>
                  <ol className="list-decimal list-inside mt-2 space-y-2">
                    <li>After finding a route, click the <strong>Algorithm Visualization</strong> tab</li>
                    <li>Use the playback controls to:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Play/pause the algorithm execution</li>
                        <li>Step forward/backward through the steps</li>
                        <li>Adjust the playback speed</li>
                        <li>Reset to the beginning</li>
                      </ul>
                    </li>
                    <li>Observe how the algorithm:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Explores nodes in order of closest distance</li>
                        <li>Updates distances when shorter paths are found</li>
                        <li>Builds the final shortest path</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Learning About the Algorithm</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Visit the <strong>Algorithm Analysis</strong> page to learn about:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>How Dijkstra&apos;s algorithm works</li>
                        <li>Time and space complexity analysis</li>
                        <li>Implementation details</li>
                        <li>Real-world applications</li>
                      </ul>
                    </li>
                    <li>Check the <strong>Documentation</strong> page for:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Project overview</li>
                        <li>Technical architecture</li>
                        <li>Data models</li>
                        <li>Usage guides</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Effective Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To get the most out of this educational tool:
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Understanding Dijkstra&apos;s Algorithm</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Start with the <strong>Algorithm Analysis</strong> page to understand the theoretical concepts</li>
                    <li>Pay attention to how the algorithm always selects the node with the minimum known distance</li>
                    <li>Notice how distances are updated when shorter paths are discovered</li>
                    <li>Observe how the algorithm stops once the destination is reached</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Effective Visualization Study</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use step-by-step mode to carefully observe each algorithm step</li>
                    <li>Pay attention to which nodes are being visited and in what order</li>
                    <li>Watch how the distance values change as shorter paths are found</li>
                    <li>Try different station combinations to see how the algorithm behaves</li>
                    <li>Compare the number of nodes explored to the length of the final path</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Experimentation Ideas</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Try finding routes between distant stations to see how the algorithm handles larger searches</li>
                    <li>Compare routes between adjacent stations and see if the algorithm behaves differently</li>
                    <li>Look for cases where the geographically shorter route isn&apos;t chosen due to the weighted graph</li>
                    <li>Study the performance metrics for different routes to understand algorithm efficiency</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">A Note on Real-world Applications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Remember that this is an educational tool with simplified data. Real-world
                      transit routing systems incorporate many additional factors such as real-time 
                      bus locations, traffic conditions, transfer times, and multiple route options.
                      However, the core principles of finding optimal paths in weighted graphs remain
                      the same across applications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}