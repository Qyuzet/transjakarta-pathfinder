# TransJakarta Pathfinder: Algorithm Analysis Project

## Project Overview

TransJakarta Pathfinder is an educational platform that demonstrates and compares pathfinding algorithms (Dijkstra's Algorithm and Breadth-First Search) for finding optimal routes on the TransJakarta bus network. This project was developed as a final assignment for the Algorithm Analysis course.

![image](https://github.com/user-attachments/assets/7fe63e7d-18af-4771-8114-9066ec276c4a)

![image](https://github.com/user-attachments/assets/8e4effb8-1394-4b58-a0a4-a1bc33647424)

![image](https://github.com/user-attachments/assets/4b42452f-f0b7-4f76-87c5-5306600e22e2)

![image](https://github.com/user-attachments/assets/bc6822e1-29ec-4a89-85a4-e5a28608e0d9)

### Key Features

- **Interactive Network Visualization**: View the TransJakarta network with stations and routes on an interactive map
- **Realistic Station Mapping**: Accurate positioning of TransJakarta stations with corridor information
- **Corridor-Specific Visualization**: Color-coded corridors with detailed station information
- **Dual Algorithm Comparison**: Compare Dijkstra's Algorithm and BFS side-by-side
- **Step-by-Step Visualization**: Watch algorithms explore the network node by node
- **Detailed Performance Metrics**: Analyze execution time, memory usage, and efficiency
- **Graph View**: Visualize the network as a graph with nodes, edges, and weights
- **Educational Documentation**: Learn about algorithm theory and implementation

## Algorithms Implemented

### Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path between nodes in a weighted graph. In our implementation:

- **Data Structure**: Priority Queue (implemented with a sorted array for simplicity)
- **Time Complexity**: O((V + E) log V) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing distances, previous nodes, and the priority queue
- **Edge Weights**: Travel time in minutes between stations (calculated based on geographic distance)
- **Termination Condition**: When the destination node is dequeued or the queue is empty

Key characteristics:

- Guarantees the shortest path in weighted graphs with non-negative weights
- Explores nodes in order of their distance from the source
- More efficient in terms of nodes explored compared to BFS
- Uses a priority queue to always process the closest node next

### Breadth-First Search (BFS)

BFS explores a graph level by level, finding the path with the fewest edges:

- **Data Structure**: Simple Queue (FIFO)
- **Time Complexity**: O(V + E) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing visited nodes, previous nodes, and the queue
- **Edge Consideration**: Treats all edges as having equal weight (ignores actual travel times)
- **Termination Condition**: When the destination node is discovered or the queue is empty

Key characteristics:

- Guarantees the path with the fewest number of edges (stations)
- Explores all nodes at the current level before moving to the next
- Simpler implementation than Dijkstra's algorithm
- Explores more nodes unnecessarily in weighted graphs

## Algorithm Comparison

The project highlights several key differences between the algorithms:

1. **Exploration Pattern**:

   - Dijkstra explores nodes based on cumulative distance from the source
   - BFS explores nodes based on their level (hop count) from the source

2. **Optimality**:

   - Dijkstra finds the shortest path by travel time (optimal for weighted graphs)
   - BFS finds the path with fewest stations (optimal for unweighted graphs)

3. **Efficiency**:

   - Dijkstra typically explores fewer nodes to find the optimal path
   - BFS explores more nodes but has a simpler implementation

4. **Visualization Differences**:
   - Dijkstra's visualization shows focused exploration toward promising paths
   - BFS visualization shows broader level-by-level exploration

## Implementation Details

### Graph Representation

The TransJakarta network is represented as:

```typescript
type Node = {
  id: string; // Unique identifier
  name: string; // Station name
  latitude: number; // Geographic coordinates
  longitude: number;
  corridor?: string; // TransJakarta corridor number
  stationType?: "terminal" | "interchange" | "regular"; // Station type
  address?: string; // Station address
  facilities?: string[]; // Available facilities
  isActive?: boolean; // Whether the station is active
};

type Edge = {
  source: string; // Source station ID
  target: string; // Target station ID
  weight: number; // Travel time in minutes
  distance: number; // Physical distance in kilometers
  corridor?: string; // TransJakarta corridor number
  color?: string; // Corridor-specific color
  routeNumber?: string; // Route identifier
  isActive?: boolean; // Whether the route is active
};

type Graph = {
  nodes: Node[]; // All stations
  edges: Edge[]; // All routes
};
```

### Algorithm Step Recording

Both algorithms record their execution steps for visualization:

```typescript
type DijkstraStep = {
  currentNode: string; // Currently processed node
  visitedNodes: string[]; // All visited nodes so far
  distances: Record<string, number>; // Current distances
  previousNodes: Record<string, string | null>; // Path tracking
};

type BFSStep = {
  currentNode: string; // Currently processed node
  visitedNodes: string[]; // All visited nodes so far
  distances: Record<string, number>; // Current distances (hop count)
  previousNodes: Record<string, string | null>; // Path tracking
};
```

### Performance Metrics

The application collects detailed metrics for each algorithm:

```typescript
type AlgorithmResult = {
  path: string[]; // Optimal path (station IDs)
  distance: number; // Total travel time/hops
  steps: AlgorithmStep[]; // All algorithm steps
  nodesExplored: number; // Total nodes processed
  edgesProcessed: number; // Total edges examined
  executionTimeMs: number; // Execution time in milliseconds
  memoryUsageEstimate: number; // Estimated memory usage in bytes
  timeComplexity: string; // Time complexity notation
  spaceComplexity: string; // Space complexity notation
  priorityQueueOperations?: number; // For Dijkstra
  queueOperations?: number; // For BFS
};
```

## Visualization Features

### Interactive Map View

The interactive map visualization shows:

- **Realistic Station Positioning**: Accurate geographic locations of TransJakarta stations
- **Station Types**:
  - Terminal: Major terminals with multiple facilities (marked with terminal icon)
  - Interchange: Transfer points between corridors (marked with interchange icon)
  - Regular: Standard stations (marked with bus icon)
- **Corridor-Specific Routes**:
  - Color-coded routes based on TransJakarta corridor numbers
  - Interactive route segments with travel information
  - Toggleable corridor layers for focused viewing
- **Station Information**:
  - Detailed popups with station name, corridor, and address
  - Available facilities at each station
  - Station type and status information

### Graph View

The graph visualization shows:

- **Nodes**: Stations in the network
- **Edges**: Routes between stations with weights (travel time)
- **Node States**:
  - Unvisited: Nodes not yet processed
  - Visited: Nodes that have been processed
  - Current: The node currently being processed
  - Path: Nodes that are part of the final path
- **Edge States**:
  - Regular: Normal connections
  - Current: Edges being considered from the current node
  - Path: Edges that are part of the final path
  - Frontier: Edges connecting visited and unvisited nodes

### List View

The list view provides detailed information about:

- Node status (visited/unvisited)
- Current distance from the source
- Previous node in the path
- Node details (name, ID)

### Performance Metrics Visualization

The metrics view shows:

- Execution time comparison
- Nodes explored comparison
- Path length comparison
- Memory usage estimates
- Data structure operations
- Efficiency ratios

## Technical Implementation

### Technologies Used

- **Next.js**: React framework for the application
- **React**: Library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **D3.js**: For interactive graph visualization
- **Leaflet**: For map visualization
- **Recharts**: For data visualization charts
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI

### Key Components

- **RouteFinder**: Main component for station selection and route calculation
- **GraphVisualization**: D3-based network visualization
- **AnimatedAlgorithmSteps**: Step-by-step algorithm visualization
- **AlgorithmComparison**: Side-by-side algorithm comparison
- **AlgorithmMetrics**: Performance metrics display
- **InteractiveMap**: Geographic map visualization with corridor-specific routes and station types
- **CorridorLayerControl**: Toggle visibility of specific TransJakarta corridors
- **StationInfoPanel**: Detailed information about TransJakarta stations
- **RouteHighlighter**: Highlights selected routes with corridor-specific styling

## Educational Value

This project serves several educational purposes:

1. **Algorithm Understanding**: Visualizes how pathfinding algorithms work step-by-step
2. **Performance Analysis**: Demonstrates the efficiency differences between algorithms
3. **Real-world Application**: Shows how algorithms apply to real transportation networks
4. **Data Structure Usage**: Illustrates the importance of appropriate data structures
5. **Complexity Analysis**: Provides practical examples of time and space complexity

## Deployment

The project is deployed on Vercel and can be accessed at TBA

## Future Enhancements

Potential improvements for future versions:

1. **Additional Algorithms**: Implement A\* and other pathfinding algorithms
2. **Real-time Data**: Integrate with real TransJakarta API for live data
3. **Multi-route Options**: Support for transfers and multiple route options
4. **Traffic Simulation**: Add simulated traffic conditions to affect travel times
5. **Advanced Visualizations**: 3D visualization of the network and algorithm execution
6. **Complete Jabodetabek Coverage**: Expand to include all TransJakarta stations in the greater Jakarta area
7. **Route Planning Features**: Add time-based scheduling and route planning
8. **Mobile Application**: Develop a mobile version for on-the-go route planning
9. **Accessibility Information**: Include accessibility features at each station
10. **Integration with Other Transport Modes**: Connect with MRT, LRT, and other public transport options

## Credits

- TransJakarta station data with enhanced corridor information and realistic positioning
- Map data from OpenStreetMap
- Algorithm implementations based on standard computer science literature
- Station facility and metadata information from TransJakarta official resources
- Corridor route information based on actual TransJakarta network

## License

MIT License
