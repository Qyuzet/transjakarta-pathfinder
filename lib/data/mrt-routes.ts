// @ts-nocheck
import { Graph, Node, Edge, TransportMode, calculateDistance } from "@/lib/utils";

// MRT Jakarta routes data
// In a real application, this would be fetched from an API or database
const mrtStations: Node[] = [
  // North-South Line (Phase 1)
  {
    id: "mrt-ns-1",
    name: "Lebak Bulus",
    latitude: -6.2894,
    longitude: 106.7742,
    stationType: "terminal",
    address: "Jl. Lebak Bulus Raya, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "prayer room"],
    isActive: true,
    transportModes: ["mrt", "transjakarta"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-2",
    name: "Fatmawati",
    latitude: -6.2833,
    longitude: 106.7925,
    stationType: "regular",
    address: "Jl. R.A. Kartini, Cilandak, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-3",
    name: "Cipete Raya",
    latitude: -6.2775,
    longitude: 106.7975,
    stationType: "regular",
    address: "Jl. Fatmawati, Cipete, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-4",
    name: "Haji Nawi",
    latitude: -6.2667,
    longitude: 106.7978,
    stationType: "regular",
    address: "Jl. Wolter Monginsidi, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-5",
    name: "Blok A",
    latitude: -6.2556,
    longitude: 106.7972,
    stationType: "regular",
    address: "Jl. RS Fatmawati, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-6",
    name: "Blok M",
    latitude: -6.2445,
    longitude: 106.7982,
    stationType: "interchange",
    address: "Jl. Melawai, Blok M, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "prayer room", "retail"],
    isActive: true,
    transportModes: ["mrt", "transjakarta", "jaklingko"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-7",
    name: "ASEAN",
    latitude: -6.2386,
    longitude: 106.7992,
    stationType: "regular",
    address: "Jl. Sisingamangaraja, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-8",
    name: "Senayan",
    latitude: -6.2273,
    longitude: 106.8027,
    stationType: "interchange",
    address: "Jl. Asia Afrika, Senayan, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "retail"],
    isActive: true,
    transportModes: ["mrt", "transjakarta"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-9",
    name: "Istora",
    latitude: -6.2219,
    longitude: 106.8075,
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-10",
    name: "Bendungan Hilir",
    latitude: -6.2147,
    longitude: 106.8139,
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Jakarta Pusat",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-11",
    name: "Setiabudi",
    latitude: -6.2083,
    longitude: 106.8208,
    stationType: "regular",
    address: "Jl. Jenderal Sudirman, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["mrt"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-12",
    name: "Dukuh Atas",
    latitude: -6.2008,
    longitude: 106.8229,
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Jakarta Pusat",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "prayer room", "retail"],
    isActive: true,
    transportModes: ["mrt", "transjakarta", "krl"],
    routeNumbers: ["NS"]
  },
  {
    id: "mrt-ns-13",
    name: "Bundaran HI",
    latitude: -6.195,
    longitude: 106.823,
    stationType: "terminal",
    address: "Jl. M.H. Thamrin, Jakarta Pusat",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "prayer room", "retail"],
    isActive: true,
    transportModes: ["mrt", "transjakarta"],
    routeNumbers: ["NS"]
  }
];

// Create edges between MRT stations
function generateMRTEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper function to connect stations in sequence
  function connectMRTStations(stationIds: string[], routeNumber: string, color: string) {
    for (let i = 0; i < stationIds.length - 1; i++) {
      edges.push(createMRTEdge(stationIds[i], stationIds[i + 1], routeNumber, color));
    }
  }

  // North-South Line
  connectMRTStations(
    [
      "mrt-ns-1", "mrt-ns-2", "mrt-ns-3", "mrt-ns-4", "mrt-ns-5", 
      "mrt-ns-6", "mrt-ns-7", "mrt-ns-8", "mrt-ns-9", "mrt-ns-10", 
      "mrt-ns-11", "mrt-ns-12", "mrt-ns-13"
    ],
    "NS",
    "#0066b3" // Blue
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

// Helper function to create an MRT edge with calculated distance and estimated travel time
function createMRTEdge(
  sourceId: string,
  targetId: string,
  routeNumber: string,
  color: string
): Edge {
  const sourceNode = mrtStations.find((node) => node.id === sourceId)!;
  const targetNode = mrtStations.find((node) => node.id === targetId)!;

  const distance = calculateDistance(
    sourceNode.latitude,
    sourceNode.longitude,
    targetNode.latitude,
    targetNode.longitude
  );

  // Estimate travel time: assume 1 minute per km + 0.5 minute for station stop (MRT is faster than TransJakarta)
  const weight = Math.round(distance * 1) + 0.5;

  // Calculate fare based on distance (simplified model)
  // Base fare 4000 IDR + 1000 IDR per km
  const fare = Math.round(4000 + (distance * 1000));

  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
    corridor: routeNumber,
    color,
    routeNumber,
    isActive: true,
    transportMode: "mrt",
    fare,
    frequency: 5, // 5 minutes between services
    operatingHours: {
      start: "05:00",
      end: "24:00"
    }
  };
}

// Create the MRT graph
export const mrtGraph: Graph = {
  nodes: mrtStations,
  edges: generateMRTEdges()
};
