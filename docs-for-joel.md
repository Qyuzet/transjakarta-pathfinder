# Jabodetabek Public Transport Pathfinder Documentation

## Project Overview

The Jabodetabek Public Transport Pathfinder is a comprehensive web application that helps users find optimal routes across the entire public transportation network in the Jabodetabek (Jakarta, Bogor, Depok, Tangerang, and Bekasi) area. The application integrates multiple transportation modes including:

- TransJakarta Bus Rapid Transit
- JakLingko Angkot (Urban Minibus)
- MRT Jakarta (Mass Rapid Transit)
- KRL Commuter Line (Commuter Rail)
- LRT Jakarta (Light Rail Transit)

The application uses graph-based pathfinding algorithms (Dijkstra's Algorithm and Breadth-First Search) to find the optimal routes between any two stations in the network, considering factors like travel time, distance, and transfers between different transportation modes.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Map Visualization**: Leaflet, react-leaflet
- **Algorithms**: Custom implementations of Dijkstra's Algorithm and BFS
- **Deployment**: Vercel

## Project Structure

```
├── app/                      # Next.js app directory
├── components/               # React components
│   ├── algorithm/            # Algorithm visualization components
│   │   ├── comparison.tsx    # Algorithm comparison component
│   │   ├── metrics.tsx       # Algorithm metrics display
│   │   ├── route-finder.tsx  # Main route finder component
│   │   └── visualization.tsx # Algorithm visualization
│   ├── map/                  # Map-related components
│   │   └── interactive-map.tsx # Interactive map component
│   └── ui/                   # UI components (shadcn/ui)
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
└── styles/                   # Global styles
```

## Key Components

### 1. Route Finder (`components/algorithm/route-finder.tsx`)

The main component that allows users to:
- Select start and end stations
- Choose the algorithm (Dijkstra, BFS, or compare both)
- View the route on the map
- See detailed route information
- Compare algorithm performance

```typescript
// Key imports
import { combinedTransportGraph } from "@/lib/data/combined-transport";
import { dijkstra } from "@/lib/dijkstra";
import { bfs } from "@/lib/bfs";

// Main component
export function RouteFinder() {
  // State for start/end stations, algorithm selection, etc.
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [endNodeId, setEndNodeId] = useState<string>("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"dijkstra" | "bfs" | "compare">("dijkstra");
  
  // Function to find route
  const handleFindRoute = () => {
    // Uses combinedTransportGraph with the selected algorithm
    // Returns path, distance, execution time, etc.
  };
  
  // Renders UI with station selectors, algorithm options, and results
}
```

### 2. Interactive Map (`components/map/interactive-map.tsx`)

Visualizes the transportation network and routes:
- Shows all stations with custom markers
- Displays routes with color-coding by transport mode
- Provides layer controls for different transport modes
- Shows detailed information in popups

```typescript
// Key imports
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl, LayerGroup } from "react-leaflet";
import { combinedTransportGraph, getTransportModeColor, getCorridorColor } from "@/lib/data/combined-transport";

// Main component
export function InteractiveMap({ selectedPath, startNodeId, endNodeId }) {
  // Renders the map with stations, routes, and controls
  return (
    <MapContainer>
      <TileLayer /> {/* Base map */}
      
      <LayersControl> {/* Layer controls for different transport modes */}
        {/* TransJakarta layers */}
        {/* JakLingko layers */}
        {/* MRT layers */}
        {/* KRL layers */}
        {/* LRT layers */}
      </LayersControl>
      
      {/* Selected route visualization */}
      {renderCorridorSpecificRoutes(selectedPath)}
    </MapContainer>
  );
}
```

### 3. Combined Transport Network (`lib/data/combined-transport.ts`)

Integrates all transportation networks into a single graph:
- Combines nodes (stations) and edges (routes) from all transport modes
- Creates transfer edges between nearby stations of different modes
- Provides utility functions for colors and icons

```typescript
// Imports individual transport networks
import { transjakartaGraph } from "./transjakarta-routes";
import { jaklingkoGraph } from "./jaklingko-routes";
import { mrtGraph } from "./mrt-routes";
import { krlGraph } from "./krl-routes";
import { lrtGraph } from "./lrt-routes";

// Creates transfer edges between different transport modes
function createTransferEdges(): Edge[] {
  // Finds stations that are close to each other
  // Creates edges between them with appropriate weights
}

// Combined graph with all transport modes
export const combinedTransportGraph: Graph = {
  nodes: [
    ...transjakartaGraph.nodes,
    ...jaklingkoGraph.nodes,
    ...mrtGraph.nodes,
    ...krlGraph.nodes,
    ...lrtGraph.nodes
  ],
  edges: [
    ...transjakartaGraph.edges,
    ...jaklingkoGraph.edges,
    ...mrtGraph.edges,
    ...krlGraph.edges,
    ...lrtGraph.edges,
    ...createTransferEdges()
  ]
};

// Utility functions
export function getTransportModeColor(mode: TransportMode): string {
  // Returns color for each transport mode
}

export function getCorridorColor(corridor: string): string {
  // Returns color for TransJakarta corridors
}

export function getTransportModeIcon(mode: TransportMode): string {
  // Returns SVG icon for each transport mode
}
```

### 4. Pathfinding Algorithms

#### Dijkstra's Algorithm (`lib/dijkstra.ts`)

Finds the shortest path based on travel time:
- Uses a priority queue for efficient node selection
- Considers edge weights (travel time in minutes)
- Returns detailed metrics about the algorithm's performance

```typescript
export function dijkstra(graph: Graph, startNodeId: string, endNodeId: string): DijkstraResult {
  // Implementation of Dijkstra's algorithm
  // Uses a priority queue to find the shortest path
  // Returns path, distance, and performance metrics
}
```

#### Breadth-First Search (`lib/bfs.ts`)

Finds the path with the fewest stations:
- Uses a queue for level-by-level exploration
- Ignores edge weights, focusing on the number of stops
- Returns detailed metrics for comparison

```typescript
export function bfs(graph: Graph, startNodeId: string, endNodeId: string): BFSResult {
  // Implementation of BFS algorithm
  // Uses a queue to find the path with fewest stations
  // Returns path, distance, and performance metrics
}
```

## Data Structure

### Graph

The transportation network is represented as a graph:

```typescript
// lib/utils.ts
export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type Node = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stationType?: "regular" | "terminal" | "interchange";
  corridor?: string;
  routeNumbers?: string[];
  transportModes?: TransportMode[];
  facilities?: string[];
  address?: string;
};

export type Edge = {
  source: string;
  target: string;
  weight: number; // Travel time in minutes
  distance: number; // Distance in kilometers
  isActive: boolean;
  color?: string;
  corridor?: string;
  routeNumber?: string;
  transportMode?: TransportMode;
  fare?: number;
  frequency?: number; // in minutes
  operatingHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
};

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
```

## How to Use the Code

### 1. Adding New Stations or Routes

To add new stations or routes to any transportation mode:

1. Find the appropriate file in `lib/data/` (e.g., `transjakarta-routes.ts`)
2. Add new nodes to the `nodes` array:

```typescript
{
  id: "tj-new-station",
  name: "New Station Name",
  latitude: -6.1234,
  longitude: 106.8765,
  stationType: "regular",
  corridor: "1",
  transportModes: ["transjakarta"],
  facilities: ["toilet", "parking"],
  address: "Jl. Example Street No. 123"
}
```

3. Add new edges to the `edges` array:

```typescript
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
```

### 2. Modifying the UI

To modify the station markers or route visualization:

1. Edit the `getStationIcon` function in `components/map/interactive-map.tsx`
2. Modify the `renderCorridorSpecificRoutes` function for route styling

### 3. Adjusting Algorithm Parameters

To modify how the algorithms work:

1. Edit the implementation in `lib/dijkstra.ts` or `lib/bfs.ts`
2. Adjust the metrics calculation in the `getAlgorithmMetrics` functions

## Deployment

The application is deployed on Vercel. To deploy updates:

1. Push changes to the GitHub repository
2. Vercel will automatically build and deploy the application

## Future Enhancements

Potential areas for improvement:

1. **Real-time data integration**: Connect to TransJakarta API for real-time bus locations
2. **Multi-modal routing optimization**: Improve transfer logic between different transport modes
3. **User location integration**: Use browser geolocation to find nearest stations
4. **Fare calculation**: Add detailed fare calculation for complete journeys
5. **Schedule integration**: Add timetable information for more accurate travel time estimates
6. **Mobile app version**: Create a mobile app using React Native

## Troubleshooting Common Issues

1. **Map not loading**: Check if Leaflet CSS is properly imported
2. **Route not found**: Verify that stations are connected in the graph
3. **Performance issues**: Consider reducing the number of markers or using clustering
4. **Layer control issues**: Ensure LayersControl components are properly structured

## Contact

For any questions or assistance with the code, please contact the project maintainer.
