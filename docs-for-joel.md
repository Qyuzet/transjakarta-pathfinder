# Jabodetabek Public Transport Pathfinder Documentation

## Project Overview

The Jabodetabek Public Transport Pathfinder is a comprehensive web application that helps users find optimal routes across the entire public transportation network in the Jabodetabek (Jakarta, Bogor, Depok, Tangerang, and Bekasi) area. The application integrates multiple transportation modes including:

- TransJakarta Bus Rapid Transit (all 10 corridors)
- JakLingko Angkot (Urban Minibus)
- MRT Jakarta (Mass Rapid Transit)
- KRL Commuter Line (Commuter Rail)
- LRT Jakarta (Light Rail Transit)

The application uses graph-based pathfinding algorithms (Dijkstra's Algorithm and Breadth-First Search) to find the optimal routes between any two stations in the network, considering factors like travel time, distance, and transfers between different transportation modes.

### Key Features

- **Multi-modal Route Planning**: Find routes that combine different transportation modes
- **Algorithm Comparison**: Compare Dijkstra's algorithm and BFS side-by-side
- **Detailed Performance Metrics**: View comprehensive algorithm performance statistics
- **Interactive Map Visualization**: See routes and stations on an interactive map
- **Step-by-step Algorithm Visualization**: Watch how each algorithm explores the network
- **Detailed Station Information**: View facilities, addresses, and other details for each station
- **Transport Mode Filtering**: Toggle visibility of different transportation networks
- **Dark/Light Mode Support**: User interface adapts to system preferences

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5, Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **Map Visualization**: Leaflet, react-leaflet
- **Chart Visualization**: Recharts
- **Graph Visualization**: D3.js
- **Animation**: Framer Motion
- **Algorithms**: Custom implementations of Dijkstra's Algorithm and BFS
- **Deployment**: Vercel with static export

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── algorithm/            # Algorithm analysis page
│   │   └── page.tsx          # Algorithm explanation and details
│   ├── documentation/        # Project documentation page
│   │   └── page.tsx          # Technical documentation
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Home page with route finder
├── components/               # React components
│   ├── algorithm/            # Algorithm-related components
│   │   ├── comparison.tsx    # Algorithm comparison component
│   │   ├── graph-visualization.tsx # D3-based graph visualization
│   │   ├── metrics.tsx       # Performance metrics display
│   │   ├── route-finder.tsx  # Main route finder component
│   │   └── visualization.tsx # Step-by-step algorithm visualization
│   ├── layout/               # Layout components
│   │   └── navbar.tsx        # Navigation bar component
│   ├── map/                  # Map-related components
│   │   └── interactive-map.tsx # Leaflet map component
│   ├── theme-provider.tsx    # Dark/light mode provider
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx        # Button component
│       ├── card.tsx          # Card component
│       ├── select.tsx        # Select dropdown component
│       ├── tabs.tsx          # Tabs component
│       └── ...               # Other UI components
├── lib/                      # Library code
│   ├── data/                 # Transportation network data
│   │   ├── combined-transport.ts  # Combined transport network
│   │   ├── transjakarta-routes.ts # TransJakarta network
│   │   ├── jaklingko-routes.ts    # JakLingko network
│   │   ├── mrt-routes.ts          # MRT network
│   │   ├── krl-routes.ts          # KRL network
│   │   └── lrt-routes.ts          # LRT network
│   ├── dijkstra.ts           # Dijkstra's algorithm implementation
│   ├── bfs.ts                # BFS algorithm implementation
│   └── utils.ts              # Utility functions and types
├── public/                   # Static assets
├── ALGORITHM_DETAILS.md      # Detailed algorithm explanations
├── components.json           # shadcn/ui configuration
├── docs-for-joel.md          # This documentation file
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── README.md                 # Project overview
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Key Components

### 1. Route Finder (`components/algorithm/route-finder.tsx`)

The main component that serves as the central hub of the application. It allows users to:

- Select start and end stations from any transportation mode
- Choose the algorithm (Dijkstra, BFS, or compare both)
- View the route on the interactive map
- See detailed route information including travel time and transfers
- Compare algorithm performance with comprehensive metrics

```typescript
// Key imports
import { useState, useEffect } from "react";
import {
  combinedTransportGraph,
  transjakartaGraph,
  jaklingkoGraph,
  mrtGraph,
  krlGraph,
  lrtGraph,
  getTransportModeColor,
} from "@/lib/data/combined-transport";
import { Node } from "@/lib/utils";
import {
  dijkstra,
  DijkstraResult,
  getAlgorithmMetrics as getDijkstraMetrics,
} from "@/lib/dijkstra";
import {
  bfs,
  BFSResult,
  getAlgorithmMetrics as getBFSMetrics,
} from "@/lib/bfs";

// Main component
export function RouteFinder() {
  // State management
  const [mounted, setMounted] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [endNodeId, setEndNodeId] = useState<string>("");
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState("map");
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "dijkstra" | "bfs" | "compare"
  >("dijkstra");

  // Get all stations from the combined graph
  const stations = combinedTransportGraph.nodes;

  // Function to find route
  const handleFindRoute = () => {
    if (!startNodeId || !endNodeId) return;

    setIsCalculating(true);
    setComparisonResult(null);

    // Small timeout to allow UI to update and show loading state
    setTimeout(() => {
      if (selectedAlgorithm === "compare") {
        // Run both algorithms and compare results
        const dijkstraResult = dijkstra(
          combinedTransportGraph,
          startNodeId,
          endNodeId
        );
        const bfsResult = bfs(combinedTransportGraph, startNodeId, endNodeId);

        // Calculate comparison metrics
        const timeDifference = dijkstraResult.distance - bfsResult.distance;
        const pathLengthDifference =
          dijkstraResult.path.length - bfsResult.path.length;
        const nodesExploredDifference =
          dijkstraResult.nodesExplored - bfsResult.nodesExplored;
        // ... more metrics calculation

        setComparisonResult({
          dijkstra: dijkstraResult,
          bfs: bfsResult,
          timeDifference,
          pathLengthDifference,
          // ... other comparison metrics
        });
      } else {
        // Run single algorithm
        let result;
        if (selectedAlgorithm === "dijkstra") {
          result = dijkstra(combinedTransportGraph, startNodeId, endNodeId);
        } else {
          result = bfs(combinedTransportGraph, startNodeId, endNodeId);
        }
        setResult(result);
      }
      setIsCalculating(false);
    }, 500);
  };

  // Renders UI with station selectors, algorithm options, and results
}
```

### 2. Interactive Map (`components/map/interactive-map.tsx`)

Visualizes the transportation network and routes on an interactive Leaflet map:

- Shows all stations with custom markers based on station type and transport mode
- Displays routes with color-coding by transport mode and corridor/route number
- Provides layer controls to toggle different transport networks and corridors
- Shows detailed information in popups (station name, facilities, address, etc.)
- Highlights selected routes with appropriate styling
- Includes a comprehensive legend explaining all map elements

```typescript
// Key imports
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import {
  combinedTransportGraph,
  transjakartaGraph,
  jaklingkoGraph,
  mrtGraph,
  krlGraph,
  lrtGraph,
  getTransportModeColor,
  getTransportModeIcon,
  getCorridorColor,
} from "@/lib/data/combined-transport";

// Default Jakarta center coordinates
const JAKARTA_CENTER = { lat: -6.1944, lng: 106.8229 };
const DEFAULT_ZOOM = 12;

// Main component
export function InteractiveMap({ selectedPath, startNodeId, endNodeId }) {
  const [showLegend, setShowLegend] = useState(true);

  // Function to create custom station icons based on type and transport mode
  const getStationIcon = (node: Node) => {
    // Create custom icon based on station type and transport mode
    // Different styling for terminals, interchanges, and regular stations
    // Special styling for start and end stations
    return new Icon({
      iconUrl: "...",
      iconSize: [24, 24],
      // ...other icon options
    });
  };

  // Function to render routes with appropriate styling
  const renderCorridorSpecificRoutes = (path: string[]) => {
    if (!path || path.length < 2) return null;

    // Group segments by transport mode for consistent styling
    const transportSegments: Record<string, any[]> = {};

    // Process each segment in the path
    for (let i = 0; i < path.length - 1; i++) {
      const sourceId = path[i];
      const targetId = path[i + 1];

      // Find the edge between these nodes
      const edge = combinedTransportGraph.edges.find(
        (e) =>
          (e.source === sourceId && e.target === targetId) ||
          (e.source === targetId && e.target === sourceId)
      );

      if (!edge) continue;

      // Get source and target nodes
      const sourceNode = getNodeById(sourceId);
      const targetNode = getNodeById(targetId);

      if (!sourceNode || !targetNode) continue;

      // Create coordinates for the line
      const coords = [
        [sourceNode.latitude, sourceNode.longitude],
        [targetNode.latitude, targetNode.longitude],
      ];

      // Group by transport mode and route number
      const transportMode = edge.transportMode || "transjakarta";
      const routeId = edge.corridor || edge.routeNumber || "unknown";
      const segmentKey = `${transportMode}-${routeId}`;

      // Add to appropriate segment group
      if (!transportSegments[segmentKey]) {
        transportSegments[segmentKey] = [];
      }

      transportSegments[segmentKey].push({
        start: sourceId,
        end: targetId,
        coords,
        transportMode,
        routeNumber: routeId,
        edge,
      });
    }

    // Render each transport mode's segments with appropriate styling
    return (
      <>
        {Object.entries(transportSegments).map(([segmentKey, segments]) => {
          // Get styling based on transport mode
          const color = getTransportModeColor(segments[0].transportMode);

          return (
            <React.Fragment key={segmentKey}>
              {segments.map((segment, idx) => (
                <Polyline
                  key={`${segmentKey}-${idx}`}
                  positions={segment.coords}
                  color={color}
                  weight={5}
                  opacity={0.8}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="text-sm font-bold">
                        {segment.transportMode.toUpperCase()} Route
                      </h3>
                      <p className="text-xs">
                        {getNodeById(segment.start)?.name} →
                        {getNodeById(segment.end)?.name}
                      </p>
                      {segment.edge.distance && (
                        <p className="text-[10px]">
                          Distance: {segment.edge.distance.toFixed(2)} km
                        </p>
                      )}
                      {segment.edge.weight && (
                        <p className="text-[10px]">
                          Travel time: {segment.edge.weight} min
                        </p>
                      )}
                      {segment.edge.fare && (
                        <p className="text-[10px]">
                          Fare: Rp {segment.edge.fare.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              ))}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-md border relative">
      {/* Map Legend and Controls */}
      <MapContainer
        center={JAKARTA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Layer controls for different transport modes */}
        <LayersControl position="topright">
          {/* TransJakarta Corridors */}
          {/* JakLingko Routes */}
          {/* MRT Lines */}
          {/* KRL Lines */}
          {/* LRT Lines */}
        </LayersControl>

        {/* Selected route visualization */}
        {renderCorridorSpecificRoutes(selectedPath)}

        {/* Start and end markers */}
      </MapContainer>
    </div>
  );
}
```

### 3. Combined Transport Network (`lib/data/combined-transport.ts`)

Integrates all transportation networks into a single unified graph:

- Combines nodes (stations) and edges (routes) from all transport modes
- Creates transfer edges between nearby stations of different modes
- Provides utility functions for colors, icons, and styling
- Handles the complexity of multi-modal transportation

```typescript
// @ts-nocheck
import { Graph, Node, Edge, TransportMode } from "@/lib/utils";
import { transjakartaGraph } from "./transjakarta-routes";
import { jaklingkoGraph } from "./jaklingko-routes";
import { mrtGraph } from "./mrt-routes";
import { krlGraph } from "./krl-routes";
import { lrtGraph } from "./lrt-routes";

// Function to create transfer edges between different transportation modes
function createTransferEdges(): Edge[] {
  const transferEdges: Edge[] = [];
  const allNodes: Node[] = [
    ...transjakartaGraph.nodes,
    ...jaklingkoGraph.nodes,
    ...mrtGraph.nodes,
    ...krlGraph.nodes,
    ...lrtGraph.nodes,
  ];

  // Maximum distance in kilometers for stations to be considered for transfers
  const MAX_TRANSFER_DISTANCE = 0.5;

  // Loop through all nodes to find potential transfers
  for (let i = 0; i < allNodes.length; i++) {
    const node1 = allNodes[i];

    // Skip if node doesn't have transport modes defined
    if (!node1.transportModes || node1.transportModes.length === 0) continue;

    for (let j = i + 1; j < allNodes.length; j++) {
      const node2 = allNodes[j];

      // Skip if node doesn't have transport modes defined
      if (!node2.transportModes || node2.transportModes.length === 0) continue;

      // Skip if both nodes are from the same transport mode
      if (node1.transportModes[0] === node2.transportModes[0]) continue;

      // Calculate distance between nodes using Haversine formula
      const distance = calculateDistance(
        node1.latitude,
        node1.longitude,
        node2.latitude,
        node2.longitude
      );

      // If nodes are close enough, create transfer edges
      if (distance <= MAX_TRANSFER_DISTANCE) {
        // Create bidirectional transfer edges
        // Walking time estimate: 5 minutes per 400 meters
        const walkingTimeMinutes = Math.ceil((distance * 1000) / 80);

        transferEdges.push({
          source: node1.id,
          target: node2.id,
          weight: walkingTimeMinutes,
          distance,
          isActive: true,
          transportMode: "transfer",
          color: "#757575", // Gray color for transfers
        });

        transferEdges.push({
          source: node2.id,
          target: node1.id,
          weight: walkingTimeMinutes,
          distance,
          isActive: true,
          transportMode: "transfer",
          color: "#757575", // Gray color for transfers
        });
      }
    }
  }

  return transferEdges;
}

// Create the combined graph with all transportation modes
export const combinedTransportGraph: Graph = {
  nodes: [
    ...transjakartaGraph.nodes,
    ...jaklingkoGraph.nodes,
    ...mrtGraph.nodes,
    ...krlGraph.nodes,
    ...lrtGraph.nodes,
  ],
  edges: [
    ...transjakartaGraph.edges,
    ...jaklingkoGraph.edges,
    ...mrtGraph.edges,
    ...krlGraph.edges,
    ...lrtGraph.edges,
    ...createTransferEdges(),
  ],
};

// Function to get transport mode color
export function getTransportModeColor(mode: TransportMode): string {
  switch (mode) {
    case "transjakarta":
      return "#d32f2f"; // Red
    case "jaklingko":
      return "#ff9800"; // Orange
    case "angkot":
      return "#ffc107"; // Amber
    case "mrt":
      return "#0066b3"; // Blue
    case "lrt":
      return "#4caf50"; // Green
    case "krl":
      return "#9c27b0"; // Purple
    case "bus":
      return "#795548"; // Brown
    case "mikrolet":
      return "#00bcd4"; // Cyan
    default:
      return "#757575"; // Gray
  }
}

// Function to get corridor color
export function getCorridorColor(corridor: string): string {
  const corridorColors: Record<string, string> = {
    "1": "#d32f2f", // Red
    "2": "#1976d2", // Blue
    "3": "#388e3c", // Green
    "4": "#ffa000", // Amber
    "5": "#7b1fa2", // Purple
    "6": "#c2185b", // Pink
    "7": "#0097a7", // Cyan
    "8": "#f57c00", // Orange
    "9": "#5d4037", // Brown
    "10": "#455a64", // Blue Grey
    B1: "#009688", // Teal
    T1: "#ff5722", // Deep Orange
    D1: "#795548", // Brown
    C1: "#607d8b", // Blue Grey
  };

  return corridorColors[corridor] || "#6366f1";
}

// Function to get transport mode icon
export function getTransportModeIcon(mode: TransportMode): string {
  switch (mode) {
    case "transjakarta":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>`;
    case "jaklingko":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><path d="M7 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M17 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>`;
    case "mrt":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train-front"><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`;
    // Additional icons for other transport modes...
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
}

// Export all graphs for individual use
export { transjakartaGraph } from "./transjakarta-routes";
export { jaklingkoGraph } from "./jaklingko-routes";
export { mrtGraph } from "./mrt-routes";
export { krlGraph } from "./krl-routes";
export { lrtGraph } from "./lrt-routes";
```

### 4. Pathfinding Algorithms

#### Dijkstra's Algorithm (`lib/dijkstra.ts`)

Finds the shortest path based on travel time:

- Uses a priority queue for efficient node selection
- Considers edge weights (travel time in minutes)
- Returns detailed metrics about the algorithm's performance
- Optimized for weighted graphs like transportation networks

```typescript
// @ts-nocheck
import { Graph, PriorityQueue, Edge } from "@/lib/utils";

export type DijkstraStep = {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  edges?: Edge[]; // Edges processed so far
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
  edges?: Edge[]; // Edges in the final path for corridor analysis
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

  // Estimate memory usage (very rough approximation)
  const memoryUsageEstimate =
    Object.keys(distances).length * 8 + // distances object
    Object.keys(previousNodes).length * 8 + // previousNodes object
    visitedNodes.length * 4 + // visitedNodes array
    steps.length * 100; // steps array (rough estimate)

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
    edges: pathEdges, // Include edges for corridor analysis
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
```

#### Breadth-First Search (`lib/bfs.ts`)

Finds the path with the fewest stations:

- Uses a queue for level-by-level exploration
- Modified to consider edge weights for fair comparison
- Returns detailed metrics for comparison with Dijkstra
- Provides step-by-step visualization data

```typescript
// @ts-nocheck
import { Graph, Edge } from "@/lib/utils";

export type BFSStep = {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  previousNodes: Record<string, string | null>;
  queue: string[];
  edges?: Edge[]; // Edges processed so far
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
  edges?: Edge[]; // Edges in the final path for corridor analysis
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

  // Reconstruct the path
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

  // Estimate memory usage (very rough approximation)
  const memoryUsageEstimate =
    Object.keys(distances).length * 8 + // distances object
    Object.keys(previousNodes).length * 8 + // previousNodes object
    visitedNodes.length * 4 + // visitedNodes array
    steps.length * 100; // steps array (rough estimate)

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
    edges: pathEdges, // Include edges for corridor analysis
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
```

## Data Structure

### Graph

The transportation network is represented as a graph with nodes (stations) and edges (routes):

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TransportMode =
  | "transjakarta"
  | "jaklingko"
  | "angkot"
  | "mrt"
  | "lrt"
  | "krl"
  | "bus"
  | "mikrolet"
  | "transfer";

export type Node = {
  id: string; // Unique identifier for the station
  name: string; // Station name
  latitude: number; // Geographic coordinates
  longitude: number;
  corridor?: string; // TransJakarta corridor number
  stationType?: "terminal" | "interchange" | "regular"; // Station type
  address?: string; // Physical address
  facilities?: string[]; // Available facilities (toilet, parking, etc.)
  isActive?: boolean; // Whether the station is currently active
  transportModes?: TransportMode[]; // Transportation modes available at this station
  routeNumbers?: string[]; // Route numbers that serve this station
};

export type Edge = {
  source: string; // Source station ID
  target: string; // Target station ID
  weight: number; // Travel time in minutes
  distance: number; // Physical distance in kilometers
  corridor?: string; // TransJakarta corridor number
  color?: string; // Line color for visualization
  routeNumber?: string; // Route identifier
  isActive?: boolean; // Whether the route is currently active
  transportMode?: TransportMode; // Mode of transportation for this edge
  fare?: number; // Cost in IDR
  frequency?: number; // Minutes between services
  operatingHours?: {
    start: string; // Start time in HH:MM format
    end: string; // End time in HH:MM format
  };
};

export type Graph = {
  nodes: Node[]; // All stations in the network
  edges: Edge[]; // All routes between stations
};

// Priority queue implementation for Dijkstra algorithm
export class PriorityQueue<T> {
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
}
```

## How to Use the Code

### 1. Adding New Stations or Routes

To add new stations or routes to any transportation mode:

1. Find the appropriate file in `lib/data/` (e.g., `transjakarta-routes.ts`, `jaklingko-routes.ts`, etc.)
2. Add new nodes to the `nodes` array:

```typescript
// Example: Adding a new TransJakarta station
{
  id: "tj-new-station",
  name: "New Station Name",
  latitude: -6.1234,
  longitude: 106.8765,
  stationType: "regular",
  corridor: "1",
  transportModes: ["transjakarta"],
  facilities: ["toilet", "parking", "waiting_room", "ticketing"],
  address: "Jl. Example Street No. 123"
}

// Example: Adding a new JakLingko station
{
  id: "jl-new-station",
  name: "New JakLingko Stop",
  latitude: -6.2345,
  longitude: 106.7654,
  stationType: "regular",
  transportModes: ["jaklingko"],
  routeNumbers: ["JAK01", "JAK03"],
  facilities: ["shelter"],
  address: "Jl. Another Street No. 456"
}
```

3. Add new edges to the `edges` array:

```typescript
// Example: Adding a new TransJakarta route
{
  source: "tj-existing-station",
  target: "tj-new-station",
  weight: 5, // 5 minutes travel time
  distance: 2.1, // 2.1 kilometers
  isActive: true,
  color: "#d32f2f",
  corridor: "1",
  transportMode: "transjakarta",
  fare: 3500,
  frequency: 10, // every 10 minutes
  operatingHours: {
    start: "05:00",
    end: "23:00"
  }
}

// Example: Adding a new JakLingko route
{
  source: "jl-existing-station",
  target: "jl-new-station",
  weight: 8, // 8 minutes travel time
  distance: 2.5, // 2.5 kilometers
  isActive: true,
  color: "#ff9800",
  routeNumber: "JAK01",
  transportMode: "jaklingko",
  fare: 5000,
  frequency: 15, // every 15 minutes
  operatingHours: {
    start: "05:30",
    end: "22:00"
  }
}
```

4. After adding new stations or routes, the combined graph will automatically include them when the application is restarted.

### 2. Adding a New Transportation Mode

To add an entirely new transportation mode:

1. Create a new file in `lib/data/` (e.g., `new-transport-mode.ts`)
2. Define the stations and routes for the new mode:

```typescript
// Example: new-transport-mode.ts
import { Graph, Node, Edge } from "@/lib/utils";

// Define stations
const stations: Node[] = [
  {
    id: "ntm-station-1",
    name: "New Transport Station 1",
    latitude: -6.1111,
    longitude: 106.8888,
    transportModes: ["new-transport"],
    // ... other properties
  },
  // ... more stations
];

// Generate edges between stations
function generateEdges(): Edge[] {
  return [
    {
      source: "ntm-station-1",
      target: "ntm-station-2",
      weight: 4,
      distance: 1.8,
      transportMode: "new-transport",
      // ... other properties
    },
    // ... more edges
  ];
}

// Create and export the graph
export const newTransportGraph: Graph = {
  nodes: stations,
  edges: generateEdges(),
};
```

3. Update the `TransportMode` type in `lib/utils.ts` to include the new mode:

```typescript
export type TransportMode =
  | "transjakarta"
  | "jaklingko"
  | "angkot"
  | "mrt"
  | "lrt"
  | "krl"
  | "bus"
  | "mikrolet"
  | "transfer"
  | "new-transport"; // Add the new mode here
```

4. Update the `combined-transport.ts` file to include the new mode:

```typescript
import { newTransportGraph } from "./new-transport-mode";

// Update the combined graph
export const combinedTransportGraph: Graph = {
  nodes: [
    ...transjakartaGraph.nodes,
    ...jaklingkoGraph.nodes,
    // ... other existing modes
    ...newTransportGraph.nodes, // Add the new mode
  ],
  edges: [
    ...transjakartaGraph.edges,
    ...jaklingkoGraph.edges,
    // ... other existing modes
    ...newTransportGraph.edges, // Add the new mode
    ...createTransferEdges(), // This will automatically create transfer edges
  ],
};

// Update the getTransportModeColor function
export function getTransportModeColor(mode: TransportMode): string {
  switch (mode) {
    // ... existing cases
    case "new-transport":
      return "#3f51b5"; // Choose a color for the new mode
    default:
      return "#757575";
  }
}

// Update the getTransportModeIcon function
export function getTransportModeIcon(mode: TransportMode): string {
  switch (mode) {
    // ... existing cases
    case "new-transport":
      return `<svg>...</svg>`; // Add an SVG icon for the new mode
    default:
      return `<svg>...</svg>`;
  }
}

// Export the new graph
export { newTransportGraph } from "./new-transport-mode";
```

### 3. Modifying the UI

To modify the station markers or route visualization:

1. Edit the `getStationIcon` function in `components/map/interactive-map.tsx`:

```typescript
const getStationIcon = (node: Node) => {
  // Determine icon based on station type and transport mode
  let iconUrl = "";
  let iconSize = [24, 24];

  // Custom styling for different station types
  if (node.id === startNodeId) {
    // Start station styling
    return new Icon({
      iconUrl: "/icons/start-marker.svg",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  } else if (node.id === endNodeId) {
    // End station styling
    return new Icon({
      iconUrl: "/icons/end-marker.svg",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  } else if (node.stationType === "terminal") {
    // Terminal station styling
    iconSize = [28, 28];
    // ... custom styling
  }

  // ... more custom styling logic

  return new Icon({
    iconUrl,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
  });
};
```

2. Modify the `renderCorridorSpecificRoutes` function for route styling:

```typescript
const renderCorridorSpecificRoutes = (path: string[]) => {
  // ... existing code

  // Customize the styling for different transport modes
  const getLineStyle = (transportMode: TransportMode, routeId: string) => {
    let weight = 5;
    let opacity = 0.8;
    let dashArray = null;

    switch (transportMode) {
      case "transjakarta":
        weight = 6;
        break;
      case "jaklingko":
        weight = 4;
        dashArray = "5, 5"; // Dashed line
        break;
      case "mrt":
        weight = 7;
        opacity = 0.9;
        break;
      // ... styles for other modes
    }

    return {
      weight,
      opacity,
      dashArray,
      color: getTransportModeColor(transportMode),
    };
  };

  // Apply the custom styling to the polylines
  return (
    <>
      {Object.entries(transportSegments).map(([segmentKey, segments]) => {
        const [transportMode, routeId] = segmentKey.split("-");
        const style = getLineStyle(transportMode as TransportMode, routeId);

        return (
          <React.Fragment key={segmentKey}>
            {segments.map((segment, idx) => (
              <Polyline
                key={`${segmentKey}-${idx}`}
                positions={segment.coords}
                {...style}
              >
                {/* Popup content */}
              </Polyline>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
```

3. Update the legend to include new transport modes:

```typescript
{
  /* Map Legend */
}
{
  showLegend && (
    <div className="absolute bottom-12 left-2 z-[1000] bg-white/90 dark:bg-gray-900/90 p-2 rounded-md shadow-md border max-w-[250px] text-xs overflow-y-auto max-h-[80vh]">
      {/* Legend content */}
      <div className="mt-2 pt-1 border-t">
        <h5 className="font-medium text-[10px] uppercase mt-1 mb-1">
          Transport Modes
        </h5>
        <div className="space-y-1">
          {/* Existing transport modes */}
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-2 rounded-full"
              style={{
                backgroundColor: getTransportModeColor("new-transport"),
              }}
            ></div>
            <span>New Transport Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Adjusting Algorithm Parameters

To modify how the algorithms work:

1. Edit the implementation in `lib/dijkstra.ts` or `lib/bfs.ts`:

```typescript
// Example: Modifying Dijkstra's algorithm to prioritize certain transport modes
export function dijkstra(
  graph: Graph,
  startNodeId: string,
  endNodeId: string,
  preferredModes: TransportMode[] = [] // New parameter
): DijkstraResult {
  // ... existing initialization code

  // Process each neighbor with modified weight calculation
  for (const edge of edges) {
    edgesProcessed++;
    const neighborId = edge.target;

    // Skip already visited nodes
    if (visitedNodes.includes(neighborId)) continue;

    // Apply weight modifier based on transport mode preference
    let weightModifier = 1.0;
    if (preferredModes.length > 0 && edge.transportMode) {
      // Reduce weight (make more attractive) for preferred modes
      if (preferredModes.includes(edge.transportMode)) {
        weightModifier = 0.8;
      } else {
        // Increase weight (make less attractive) for non-preferred modes
        weightModifier = 1.2;
      }
    }

    // Calculate potential new distance with modifier
    const newDistance = distances[currentNodeId] + edge.weight * weightModifier;

    // Update if we found a shorter path
    if (newDistance < distances[neighborId]) {
      distances[neighborId] = newDistance;
      previousNodes[neighborId] = currentNodeId;
      pq.enqueue(neighborId, newDistance);
      priorityQueueOperations++;
    }
  }

  // ... rest of the algorithm
}
```

2. Adjust the metrics calculation in the `getAlgorithmMetrics` functions:

```typescript
export function getAlgorithmMetrics(result: DijkstraResult) {
  // Calculate additional metrics
  const averageEdgeWeight =
    result.path.length > 1 ? result.distance / (result.path.length - 1) : 0;

  const transportModeBreakdown = result.edges
    ? result.edges.reduce((acc, edge) => {
        const mode = edge.transportMode || "unknown";
        acc[mode] = (acc[mode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return {
    // ... existing metrics
    averageEdgeWeight,
    transportModeBreakdown,
    // Add more custom metrics
  };
}
```

## Deployment

The application is deployed on Vercel with static export. To deploy updates:

1. Push changes to the GitHub repository
2. Vercel will automatically build and deploy the application

### Manual Deployment Steps

If you need to deploy manually:

1. Build the application:

```bash
npm run build
```

2. The static files will be generated in the `out` directory
3. Deploy these files to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)

### Vercel Configuration

The project includes a `next.config.js` file with the following configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

This configuration:

- Sets `output: 'export'` to generate static HTML files
- Disables ESLint during builds to avoid deployment failures
- Sets `images: { unoptimized: true }` to handle images in static export

## Future Enhancements

Potential areas for improvement:

### 1. Real-time Data Integration

- Connect to TransJakarta API for real-time bus locations
- Implement a backend service to fetch and cache real-time data
- Add real-time arrival predictions for stations
- Show vehicle positions on the map

### 2. Multi-modal Routing Optimization

- Improve transfer logic between different transport modes
- Add preferences for specific transport modes
- Implement more sophisticated routing algorithms that consider:
  - Transfer waiting times
  - Walking distances between stations
  - Time of day (rush hour vs. off-peak)
  - Weather conditions

### 3. User Experience Improvements

- Add user location integration using browser geolocation
- Implement "find nearest station" functionality
- Add favorites/bookmarks for frequently used routes
- Implement route history
- Add accessibility features for users with disabilities
- Support multiple languages (Indonesian, English, etc.)

### 4. Advanced Features

- Add detailed fare calculation for complete journeys
- Implement schedule integration with timetable information
- Add carbon footprint calculation for different route options
- Implement offline support with service workers
- Add turn-by-turn navigation instructions

### 5. Mobile Experience

- Create a mobile app version using React Native
- Implement push notifications for service disruptions
- Add offline maps for areas with poor connectivity
- Optimize performance for low-end devices

### 6. Data Expansion

- Add more transportation modes (e.g., Gojek, Grab, taxis)
- Expand coverage to more areas in Indonesia
- Include points of interest near stations
- Add detailed information about station facilities

## Troubleshooting Common Issues

### Map-related Issues

1. **Map not loading**:

   - Check if Leaflet CSS is properly imported in `app/layout.tsx`
   - Verify that the MapContainer component is only rendered client-side using dynamic import
   - Check browser console for CORS or other errors

2. **Map markers not appearing**:

   - Verify that the marker coordinates are valid
   - Check if the icon URLs are correct
   - Ensure the marker z-index is high enough to be visible

3. **Layer control issues**:
   - Ensure LayersControl components are properly structured
   - Verify that each LayersControl.Overlay has a unique key
   - Check that LayerGroup components are properly nested

### Algorithm Issues

1. **Route not found**:

   - Verify that stations are connected in the graph
   - Check if start and end stations exist in the graph
   - Ensure there's a valid path between the stations
   - Look for disconnected subgraphs in the network

2. **Incorrect routes**:

   - Check edge weights and directions
   - Verify that transfer edges are correctly created
   - Ensure the algorithm is considering all relevant edges

3. **Performance issues**:
   - Consider reducing the number of markers or using clustering
   - Optimize the graph by removing redundant edges
   - Implement algorithm optimizations like A\* search
   - Use Web Workers for computationally intensive tasks

### UI/UX Issues

1. **Slow rendering**:

   - Use React.memo or useMemo for expensive components
   - Implement virtualization for long lists
   - Optimize re-renders by using proper React patterns

2. **Mobile responsiveness**:

   - Test on various device sizes
   - Use responsive design patterns
   - Implement mobile-specific UI components

3. **Dark mode issues**:
   - Ensure all components respect the theme
   - Check contrast ratios for accessibility
   - Test both themes thoroughly

## Contact

For any questions or assistance with the code, please contact the project maintainer.

### Contributing

If you'd like to contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please follow the existing code style and include appropriate tests for your changes.
