// @ts-nocheck
import { Graph, Node, Edge, TransportMode, calculateDistance } from "@/lib/utils";

// Jaklingko Angkot routes data for Jabodetabek area
// In a real application, this would be fetched from an API or database
const jaklingkoStations: Node[] = [
  // JAK01: Kampung Melayu - Tanah Abang
  {
    id: "jak01-1",
    name: "Kampung Melayu",
    latitude: -6.2147,
    longitude: 106.8656,
    stationType: "terminal",
    address: "Terminal Kampung Melayu, Jakarta Timur",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK01"]
  },
  {
    id: "jak01-2",
    name: "Bidara Cina",
    latitude: -6.2222,
    longitude: 106.8664,
    stationType: "regular",
    address: "Jl. DI Panjaitan, Jakarta Timur",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK01"]
  },
  {
    id: "jak01-3",
    name: "Pasar Rumput",
    latitude: -6.2083,
    longitude: 106.8417,
    stationType: "regular",
    address: "Jl. Pasar Rumput, Jakarta Selatan",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko"],
    routeNumbers: ["JAK01"]
  },
  {
    id: "jak01-4",
    name: "Karet Pedurenan",
    latitude: -6.2194,
    longitude: 106.8264,
    stationType: "regular",
    address: "Jl. Karet Pedurenan, Jakarta Selatan",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko"],
    routeNumbers: ["JAK01"]
  },
  {
    id: "jak01-5",
    name: "Tanah Abang",
    latitude: -6.1856,
    longitude: 106.8172,
    stationType: "terminal",
    address: "Terminal Tanah Abang, Jakarta Pusat",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "krl"],
    routeNumbers: ["JAK01"]
  },

  // JAK02: Kampung Rambutan - Kampung Melayu
  {
    id: "jak02-1",
    name: "Kampung Rambutan",
    latitude: -6.2597,
    longitude: 106.8706,
    stationType: "terminal",
    address: "Terminal Kampung Rambutan, Jakarta Timur",
    facilities: ["waiting area", "ticket booth", "toilet"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "bus"],
    routeNumbers: ["JAK02"]
  },
  {
    id: "jak02-2",
    name: "Taman Mini",
    latitude: -6.2736,
    longitude: 106.8939,
    stationType: "regular",
    address: "Jl. Taman Mini Raya, Jakarta Timur",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK02"]
  },
  {
    id: "jak02-3",
    name: "Cawang UKI",
    latitude: -6.2372,
    longitude: 106.868,
    stationType: "interchange",
    address: "Jl. Mayjen Sutoyo, Cawang, Jakarta Timur",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK02"]
  },
  {
    id: "jak02-4",
    name: "Kampung Melayu",
    latitude: -6.2147,
    longitude: 106.8656,
    stationType: "terminal",
    address: "Terminal Kampung Melayu, Jakarta Timur",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK02", "JAK01"]
  },

  // JAK03: Pulogadung - Ancol
  {
    id: "jak03-1",
    name: "Pulogadung",
    latitude: -6.1841,
    longitude: 106.8993,
    stationType: "terminal",
    address: "Terminal Pulogadung, Jakarta Timur",
    facilities: ["waiting area", "ticket booth", "toilet"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "bus"],
    routeNumbers: ["JAK03"]
  },
  {
    id: "jak03-2",
    name: "Pramuka",
    latitude: -6.1856,
    longitude: 106.8556,
    stationType: "interchange",
    address: "Jl. Pramuka, Jakarta Timur",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK03"]
  },
  {
    id: "jak03-3",
    name: "Senen",
    latitude: -6.1767,
    longitude: 106.8417,
    stationType: "interchange",
    address: "Jl. Senen Raya, Jakarta Pusat",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "krl"],
    routeNumbers: ["JAK03"]
  },
  {
    id: "jak03-4",
    name: "Gunung Sahari",
    latitude: -6.1414,
    longitude: 106.8333,
    stationType: "regular",
    address: "Jl. Gunung Sahari, Jakarta Pusat",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK03"]
  },
  {
    id: "jak03-5",
    name: "Ancol",
    latitude: -6.1264,
    longitude: 106.8306,
    stationType: "terminal",
    address: "Jl. Lodan Raya, Ancol, Jakarta Utara",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK03"]
  },

  // JAK04: Grogol - Blok M
  {
    id: "jak04-1",
    name: "Grogol",
    latitude: -6.1681,
    longitude: 106.8031,
    stationType: "terminal",
    address: "Terminal Grogol, Jakarta Barat",
    facilities: ["waiting area", "ticket booth", "toilet"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "bus"],
    routeNumbers: ["JAK04"]
  },
  {
    id: "jak04-2",
    name: "Slipi",
    latitude: -6.1911,
    longitude: 106.7994,
    stationType: "regular",
    address: "Jl. Gatot Subroto, Slipi, Jakarta Barat",
    facilities: ["waiting area"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK04"]
  },
  {
    id: "jak04-3",
    name: "Senayan",
    latitude: -6.2273,
    longitude: 106.8027,
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Senayan, Jakarta Selatan",
    facilities: ["waiting area", "ticket booth"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta"],
    routeNumbers: ["JAK04"]
  },
  {
    id: "jak04-4",
    name: "Blok M",
    latitude: -6.2445,
    longitude: 106.7982,
    stationType: "terminal",
    address: "Terminal Blok M, Jakarta Selatan",
    facilities: ["waiting area", "ticket booth", "toilet"],
    isActive: true,
    transportModes: ["jaklingko", "transjakarta", "mrt"],
    routeNumbers: ["JAK04"]
  }
];

// Create edges between Jaklingko stations
function generateJaklingkoEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper function to connect stations in sequence
  function connectJaklingkoStations(stationIds: string[], routeNumber: string, color: string) {
    for (let i = 0; i < stationIds.length - 1; i++) {
      edges.push(createJaklingkoEdge(stationIds[i], stationIds[i + 1], routeNumber, color));
    }
  }

  // JAK01: Kampung Melayu - Tanah Abang (Orange)
  connectJaklingkoStations(
    ["jak01-1", "jak01-2", "jak01-3", "jak01-4", "jak01-5"],
    "JAK01",
    "#FF9800" // Orange
  );

  // JAK02: Kampung Rambutan - Kampung Melayu (Green)
  connectJaklingkoStations(
    ["jak02-1", "jak02-2", "jak02-3", "jak02-4"],
    "JAK02",
    "#4CAF50" // Green
  );

  // JAK03: Pulogadung - Ancol (Blue)
  connectJaklingkoStations(
    ["jak03-1", "jak03-2", "jak03-3", "jak03-4", "jak03-5"],
    "JAK03",
    "#2196F3" // Blue
  );

  // JAK04: Grogol - Blok M (Purple)
  connectJaklingkoStations(
    ["jak04-1", "jak04-2", "jak04-3", "jak04-4"],
    "JAK04",
    "#9C27B0" // Purple
  );

  // Make connections bidirectional
  const bidirectionalEdges = [...edges];
  edges.forEach((edge) => {
    bidirectionalEdges.push({
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
      distance: edge.distance,
      corridor: edge.corridor,
      color: edge.color,
      routeNumber: edge.routeNumber,
      isActive: edge.isActive,
      transportMode: edge.transportMode,
      fare: edge.fare,
      frequency: edge.frequency,
      operatingHours: edge.operatingHours
    });
  });

  return bidirectionalEdges;
}

// Helper function to create a Jaklingko edge with calculated distance and estimated travel time
function createJaklingkoEdge(
  sourceId: string,
  targetId: string,
  routeNumber: string,
  color: string
): Edge {
  const sourceNode = jaklingkoStations.find((node) => node.id === sourceId)!;
  const targetNode = jaklingkoStations.find((node) => node.id === targetId)!;

  const distance = calculateDistance(
    sourceNode.latitude,
    sourceNode.longitude,
    targetNode.latitude,
    targetNode.longitude
  );

  // Estimate travel time: assume 3 minutes per km + 1 minute for station stop (Angkot is slower than TransJakarta)
  const weight = Math.round(distance * 3) + 1;

  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
    corridor: routeNumber,
    color,
    routeNumber,
    isActive: true,
    transportMode: "jaklingko",
    fare: 5000, // Fixed fare in IDR
    frequency: 10, // 10 minutes between services
    operatingHours: {
      start: "05:00",
      end: "22:00"
    }
  };
}

// Create the Jaklingko graph
export const jaklingkoGraph: Graph = {
  nodes: jaklingkoStations,
  edges: generateJaklingkoEdges()
};
