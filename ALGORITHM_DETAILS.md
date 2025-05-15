# Detailed Algorithm Analysis

This document provides in-depth explanations of the algorithms implemented in the TransJakarta Pathfinder project.

## Dijkstra's Algorithm

### Core Concept

Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative weights. It works by maintaining a set of nodes whose shortest distance from the source is already known and continuously selecting the node with the minimum distance from the unvisited set.

### Pseudocode

```
function Dijkstra(Graph, source, destination):
    // Initialize
    for each vertex v in Graph:
        distance[v] = INFINITY
        previous[v] = UNDEFINED
        visited[v] = false
    
    distance[source] = 0
    priorityQueue = new PriorityQueue()
    priorityQueue.enqueue(source, 0)
    
    // Main loop
    while priorityQueue is not empty:
        current = priorityQueue.dequeue()
        
        if current == destination:
            break  // Found the destination
            
        if visited[current]:
            continue  // Skip if already processed
            
        visited[current] = true
        
        // Record step for visualization
        recordStep(current, visited, distance, previous)
        
        // Process neighbors
        for each neighbor of current:
            if visited[neighbor]:
                continue
                
            edgeWeight = getWeight(current, neighbor)
            newDistance = distance[current] + edgeWeight
            
            if newDistance < distance[neighbor]:
                distance[neighbor] = newDistance
                previous[neighbor] = current
                priorityQueue.enqueue(neighbor, newDistance)
    
    // Reconstruct path
    path = []
    current = destination
    while current != UNDEFINED:
        path.prepend(current)
        current = previous[current]
        
    return path, distance[destination]
```

### Implementation Details

Our implementation uses a simplified priority queue:

```typescript
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

While this implementation is not the most efficient (a binary heap would be better for large graphs), it's simpler to understand and sufficient for our educational purposes.

### Time and Space Complexity Analysis

- **Time Complexity**: O((V + E) log V)
  - Each vertex is extracted from the priority queue once: O(V log V)
  - Each edge is examined once: O(E log V)
  - Combined: O((V + E) log V)

- **Space Complexity**: O(V)
  - Distance array: O(V)
  - Previous nodes array: O(V)
  - Priority queue: O(V)
  - Visited set: O(V)

### Why Dijkstra Shows Fewer Nodes in Visualization

Dijkstra's algorithm is more focused in its exploration because:

1. It always processes the node with the smallest known distance next
2. It can terminate early once the destination is reached (since we know we've found the shortest path)
3. It prioritizes promising paths and may never explore distant nodes

This focused exploration is why Dijkstra typically shows fewer nodes in the visualization compared to BFS.

## Breadth-First Search (BFS)

### Core Concept

BFS explores a graph level by level, starting from the source node and exploring all neighbors before moving to the next level. It guarantees finding the path with the fewest edges in an unweighted graph.

### Pseudocode

```
function BFS(Graph, source, destination):
    // Initialize
    for each vertex v in Graph:
        distance[v] = INFINITY
        previous[v] = UNDEFINED
        visited[v] = false
    
    distance[source] = 0
    visited[source] = true
    queue = new Queue()
    queue.enqueue(source)
    
    // Main loop
    while queue is not empty:
        current = queue.dequeue()
        
        // Record step for visualization
        recordStep(current, visited, distance, previous)
        
        if current == destination:
            break  // Found the destination
        
        // Process neighbors
        for each neighbor of current:
            if not visited[neighbor]:
                visited[neighbor] = true
                distance[neighbor] = distance[current] + 1
                previous[neighbor] = current
                queue.enqueue(neighbor)
    
    // Reconstruct path
    path = []
    current = destination
    while current != UNDEFINED:
        path.prepend(current)
        current = previous[current]
        
    return path, distance[destination]
```

### Implementation Details

BFS uses a simple FIFO queue:

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
```

### Time and Space Complexity Analysis

- **Time Complexity**: O(V + E)
  - Each vertex is dequeued once: O(V)
  - Each edge is examined once: O(E)
  - Combined: O(V + E)

- **Space Complexity**: O(V)
  - Distance array: O(V)
  - Previous nodes array: O(V)
  - Queue: O(V) in worst case
  - Visited set: O(V)

### Why BFS Shows More Nodes in Visualization

BFS explores more broadly because:

1. It processes all nodes at the current level before moving to the next level
2. It doesn't consider edge weights, so it explores in all directions equally
3. It continues exploring the current level even after finding the destination
4. It doesn't prioritize promising paths based on distance

This level-by-level exploration is why BFS typically shows more nodes in the visualization compared to Dijkstra.

## Key Differences Between Algorithms

### Exploration Strategy

- **Dijkstra**: Explores based on cumulative distance from source (greedy approach)
- **BFS**: Explores based on number of edges from source (level-by-level approach)

### Optimality

- **Dijkstra**: Optimal for weighted graphs (finds shortest path by travel time)
- **BFS**: Optimal for unweighted graphs (finds path with fewest stations)

### Data Structure

- **Dijkstra**: Priority Queue (processes nodes in order of distance)
- **BFS**: Simple Queue (processes nodes in order of discovery)

### Performance Characteristics

- **Dijkstra**:
  - More complex implementation
  - Higher computational overhead per operation
  - More efficient exploration (fewer nodes processed)
  - Better for weighted graphs

- **BFS**:
  - Simpler implementation
  - Lower computational overhead per operation
  - Less efficient exploration (more nodes processed)
  - Better for unweighted graphs

### Visual Differences in Exploration

The visualization clearly shows these differences:

1. **Node Count**: BFS typically explores more nodes than Dijkstra
2. **Exploration Pattern**: 
   - Dijkstra shows a more focused exploration toward the destination
   - BFS shows a more circular, level-by-level expansion
3. **Path Selection**:
   - Dijkstra may find a path with more stations but less travel time
   - BFS always finds the path with the fewest stations

## When to Use Each Algorithm

- **Use Dijkstra when**:
  - Edge weights matter (travel time, distance, cost)
  - You need the truly shortest path by some metric
  - The graph is weighted with non-negative weights
  - Efficiency in exploration is important

- **Use BFS when**:
  - All edges have equal weight or weights don't matter
  - You need the path with fewest edges/stops
  - The graph is unweighted or can be treated as such
  - Implementation simplicity is preferred
