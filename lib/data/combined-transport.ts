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

  // Find nodes that are close to each other (potential transfers)
  for (let i = 0; i < allNodes.length; i++) {
    const node1 = allNodes[i];

    // Skip if node doesn't have transportModes
    if (!node1.transportModes || node1.transportModes.length <= 1) continue;

    for (let j = i + 1; j < allNodes.length; j++) {
      const node2 = allNodes[j];

      // Skip if node doesn't have transportModes
      if (!node2.transportModes || node2.transportModes.length <= 1) continue;

      // Check if nodes have different IDs but same name or are very close to each other
      const sameName = node1.name === node2.name;

      // Calculate distance between nodes
      const lat1 = node1.latitude;
      const lon1 = node1.longitude;
      const lat2 = node2.latitude;
      const lon2 = node2.longitude;

      // Haversine formula to calculate distance
      const R = 6371; // Radius of the Earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // If nodes are close enough (within 300 meters) or have the same name, create transfer edges
      if (sameName || distance <= 0.3) {
        // Check if nodes have different transport modes
        const node1Modes = node1.transportModes || [];
        const node2Modes = node2.transportModes || [];

        // Find transport modes that are in node2 but not in node1
        const differentModes = node2Modes.filter(
          (mode) => !node1Modes.includes(mode)
        );

        if (differentModes.length > 0) {
          // Create transfer edge
          transferEdges.push({
            source: node1.id,
            target: node2.id,
            weight: 5, // 5 minutes for transfer
            distance: distance,
            color: "#757575", // Gray for transfers
            routeNumber: "Transfer",
            isActive: true,
            transportMode: "transfer",
            fare: 0, // No additional fare for transfer
            frequency: 0, // Not applicable for transfers
            operatingHours: {
              start: "05:00",
              end: "24:00",
            },
          });

          // Create reverse transfer edge
          transferEdges.push({
            source: node2.id,
            target: node1.id,
            weight: 5, // 5 minutes for transfer
            distance: distance,
            color: "#757575", // Gray for transfers
            routeNumber: "Transfer",
            isActive: true,
            transportMode: "transfer",
            fare: 0, // No additional fare for transfer
            frequency: 0, // Not applicable for transfers
            operatingHours: {
              start: "05:00",
              end: "24:00",
            },
          });
        }
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
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>`;
    case "angkot":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
    case "mrt":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train-front"><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`;
    case "lrt":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train-track"><path d="M2 17 17 2"/><path d="m2 14 8 8"/><path d="m5 11 8 8"/><path d="m8 8 8 8"/><path d="m11 5 8 8"/><path d="m14 2 8 8"/><path d="M7 22 22 7"/></svg>`;
    case "krl":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/></svg>`;
    case "bus":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>`;
    case "mikrolet":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
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
