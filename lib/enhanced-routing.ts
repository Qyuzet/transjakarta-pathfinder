// @ts-nocheck
import { Graph, Node, Edge, RoutingMode, RouteSegment } from "./utils";
import { getRealisticRouteForPath } from "./osrm-service";
import { calculateDistance } from "./utils";

/**
 * Enhanced routing service that supports both straight-line and OSRM realistic routing
 */
export class EnhancedRoutingService {
  private routingMode: RoutingMode = "straight-line";
  private routeCache = new Map<string, any>();

  constructor(initialMode: RoutingMode = "straight-line") {
    this.routingMode = initialMode;
  }

  /**
   * Set the routing mode
   */
  setRoutingMode(mode: RoutingMode): void {
    this.routingMode = mode;
  }

  /**
   * Get the current routing mode
   */
  getRoutingMode(): RoutingMode {
    return this.routingMode;
  }

  /**
   * Get route segments for visualization based on current mode
   */
  async getRouteSegments(
    path: string[],
    graph: Graph
  ): Promise<RouteSegment[]> {
    if (path.length < 2) {
      return [];
    }

    const cacheKey = `${this.routingMode}-${path.join('-')}`;

    if (this.routeCache.has(cacheKey)) {
      console.log("Using cached route segments for", this.routingMode);
      return this.routeCache.get(cacheKey);
    }

    console.log("Generating route segments for mode:", this.routingMode);
    const segments: RouteSegment[] = [];

    if (this.routingMode === "osrm-realistic") {
      console.log("Using OSRM for realistic routing...");
      // Use OSRM for realistic routing
      const stations = path.map(nodeId =>
        graph.nodes.find(node => node.id === nodeId)
      ).filter(Boolean) as Node[];

      console.log("Stations for OSRM:", stations.map(s => s.name));

      const realisticRoute = await getRealisticRouteForPath(stations, "driving");

      if (realisticRoute) {
        console.log("OSRM route found:", realisticRoute);
        // Group segments by transport mode
        for (let i = 0; i < path.length - 1; i++) {
          const sourceId = path[i];
          const targetId = path[i + 1];

          // Find the edge to get transport mode info
          const edge = graph.edges.find(e =>
            (e.source === sourceId && e.target === targetId) ||
            (e.source === targetId && e.target === sourceId)
          );

          const segment = realisticRoute.segments[i];

          if (segment && edge) {
            console.log(`Creating OSRM segment ${i}:`, segment.geometry.length, "coordinates");
            segments.push({
              coordinates: segment.geometry,
              transportMode: edge.transportMode || "transjakarta",
              routeInfo: {
                name: `${edge.transportMode || "transjakarta"} ${edge.corridor || edge.routeNumber || ""}`.trim(),
                color: edge.color || "#d32f2f",
                routeNumber: edge.routeNumber,
                corridor: edge.corridor,
              },
              duration: segment.duration,
              distance: segment.distance,
              instructions: segment.instructions,
            });
          }
        }
        console.log("Total OSRM segments created:", segments.length);
      } else {
        console.log("OSRM failed, falling back to straight-line");
        // Fallback to straight-line if OSRM fails
        return this.getStraightLineSegments(path, graph);
      }
    } else {
      console.log("Using straight-line routing");
      // Use straight-line routing (current implementation)
      return this.getStraightLineSegments(path, graph);
    }

    // Cache the result
    this.routeCache.set(cacheKey, segments);
    console.log("Cached segments for", this.routingMode, ":", segments.length);
    return segments;
  }

  /**
   * Get straight-line segments (current implementation)
   */
  private getStraightLineSegments(path: string[], graph: Graph): RouteSegment[] {
    const segments: RouteSegment[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const sourceId = path[i];
      const targetId = path[i + 1];
      
      const sourceNode = graph.nodes.find(node => node.id === sourceId);
      const targetNode = graph.nodes.find(node => node.id === targetId);
      const edge = graph.edges.find(e => 
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
      );

      if (sourceNode && targetNode && edge) {
        // Leaflet uses [lat, lng] format
        const coordinates: [number, number][] = [
          [sourceNode.latitude, sourceNode.longitude],
          [targetNode.latitude, targetNode.longitude],
        ];

        segments.push({
          coordinates,
          transportMode: edge.transportMode || "transjakarta",
          routeInfo: {
            name: `${edge.transportMode || "transjakarta"} ${edge.corridor || edge.routeNumber || ""}`.trim(),
            color: edge.color || "#d32f2f",
            routeNumber: edge.routeNumber,
            corridor: edge.corridor,
          },
          duration: edge.weight, // Already in minutes
          distance: edge.distance, // Already in kilometers
          instructions: [`Travel from ${sourceNode.name} to ${targetNode.name}`],
        });
      }
    }

    return segments;
  }

  /**
   * Calculate enhanced route metrics
   */
  async getRouteMetrics(
    path: string[],
    graph: Graph
  ): Promise<{
    totalDuration: number; // in minutes
    totalDistance: number; // in kilometers
    segmentCount: number;
    transportModes: string[];
    routingMode: RoutingMode;
    isRealistic: boolean;
  }> {
    const segments = await this.getRouteSegments(path, graph);
    
    const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);
    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    const transportModes = [...new Set(segments.map(s => s.transportMode))];

    return {
      totalDuration,
      totalDistance,
      segmentCount: segments.length,
      transportModes,
      routingMode: this.routingMode,
      isRealistic: this.routingMode === "osrm-realistic",
    };
  }

  /**
   * Get turn-by-turn instructions for the route
   */
  async getRouteInstructions(
    path: string[],
    graph: Graph
  ): Promise<string[]> {
    const segments = await this.getRouteSegments(path, graph);
    
    const instructions: string[] = [];
    
    segments.forEach((segment, index) => {
      const sourceNode = graph.nodes.find(n => n.id === path[index]);
      const targetNode = graph.nodes.find(n => n.id === path[index + 1]);
      
      if (sourceNode && targetNode) {
        instructions.push(`${index + 1}. Take ${segment.routeInfo.name} from ${sourceNode.name} to ${targetNode.name}`);
        
        if (segment.instructions && segment.instructions.length > 0 && this.routingMode === "osrm-realistic") {
          // Add detailed OSRM instructions
          segment.instructions.forEach(instruction => {
            instructions.push(`   • ${instruction}`);
          });
        }
        
        instructions.push(`   Duration: ${segment.duration.toFixed(1)} minutes, Distance: ${segment.distance.toFixed(2)} km`);
      }
    });

    return instructions;
  }

  /**
   * Compare routing modes for the same path
   */
  async compareRoutingModes(
    path: string[],
    graph: Graph
  ): Promise<{
    straightLine: {
      duration: number;
      distance: number;
      segments: RouteSegment[];
    };
    realistic: {
      duration: number;
      distance: number;
      segments: RouteSegment[];
    };
    difference: {
      durationDiff: number; // realistic - straight-line
      distanceDiff: number;
      percentageDurationIncrease: number;
      percentageDistanceIncrease: number;
    };
  }> {
    // Get straight-line route
    const originalMode = this.routingMode;
    
    this.setRoutingMode("straight-line");
    const straightLineSegments = await this.getRouteSegments(path, graph);
    const straightLineMetrics = await this.getRouteMetrics(path, graph);
    
    this.setRoutingMode("osrm-realistic");
    const realisticSegments = await this.getRouteSegments(path, graph);
    const realisticMetrics = await this.getRouteMetrics(path, graph);
    
    // Restore original mode
    this.setRoutingMode(originalMode);

    const durationDiff = realisticMetrics.totalDuration - straightLineMetrics.totalDuration;
    const distanceDiff = realisticMetrics.totalDistance - straightLineMetrics.totalDistance;
    
    return {
      straightLine: {
        duration: straightLineMetrics.totalDuration,
        distance: straightLineMetrics.totalDistance,
        segments: straightLineSegments,
      },
      realistic: {
        duration: realisticMetrics.totalDuration,
        distance: realisticMetrics.totalDistance,
        segments: realisticSegments,
      },
      difference: {
        durationDiff,
        distanceDiff,
        percentageDurationIncrease: straightLineMetrics.totalDuration > 0 
          ? (durationDiff / straightLineMetrics.totalDuration) * 100 
          : 0,
        percentageDistanceIncrease: straightLineMetrics.totalDistance > 0 
          ? (distanceDiff / straightLineMetrics.totalDistance) * 100 
          : 0,
      },
    };
  }

  /**
   * Clear routing cache
   */
  clearCache(): void {
    this.routeCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.routeCache.size,
      keys: Array.from(this.routeCache.keys()),
    };
  }
}

// Create a singleton instance
export const enhancedRoutingService = new EnhancedRoutingService();
