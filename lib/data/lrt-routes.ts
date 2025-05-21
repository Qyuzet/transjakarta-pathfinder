// @ts-nocheck
import { Graph, Node, Edge, TransportMode, calculateDistance } from "@/lib/utils";

// LRT Jakarta routes data
// In a real application, this would be fetched from an API or database
const lrtStations: Node[] = [
  // LRT Jakarta (Phase 1)
  {
    id: "lrt-jkt-1",
    name: "Pegangsaan Dua",
    latitude: -6.1583,
    longitude: 106.9125,
    stationType: "terminal",
    address: "Jl. Pegangsaan Dua, Jakarta Utara",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["LRT1"]
  },
  {
    id: "lrt-jkt-2",
    name: "Boulevard Utara",
    latitude: -6.1528,
    longitude: 106.9089,
    stationType: "regular",
    address: "Jl. Boulevard Utara, Kelapa Gading, Jakarta Utara",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["LRT1"]
  },
  {
    id: "lrt-jkt-3",
    name: "Boulevard Selatan",
    latitude: -6.1625,
    longitude: 106.9056,
    stationType: "regular",
    address: "Jl. Boulevard Selatan, Kelapa Gading, Jakarta Utara",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["LRT1"]
  },
  {
    id: "lrt-jkt-4",
    name: "Pulomas",
    latitude: -6.1689,
    longitude: 106.8822,
    stationType: "regular",
    address: "Jl. Kayu Putih Raya, Pulomas, Jakarta Timur",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt", "transjakarta"],
    routeNumbers: ["LRT1"]
  },
  {
    id: "lrt-jkt-5",
    name: "Equestrian",
    latitude: -6.1736,
    longitude: 106.8778,
    stationType: "regular",
    address: "Jl. Pulomas Jaya, Jakarta Timur",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["LRT1"]
  },
  {
    id: "lrt-jkt-6",
    name: "Velodrome",
    latitude: -6.1783,
    longitude: 106.8731,
    stationType: "terminal",
    address: "Jl. Pemuda, Rawamangun, Jakarta Timur",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "retail"],
    isActive: true,
    transportModes: ["lrt", "transjakarta"],
    routeNumbers: ["LRT1"]
  },

  // LRT Jabodebek (Phase 1)
  {
    id: "lrt-jdb-1",
    name: "Cawang",
    latitude: -6.2422,
    longitude: 106.8658,
    stationType: "interchange",
    address: "Jl. MT Haryono, Cawang, Jakarta Timur",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt", "krl"],
    routeNumbers: ["JDB1"]
  },
  {
    id: "lrt-jdb-2",
    name: "Cikoko",
    latitude: -6.2486,
    longitude: 106.8583,
    stationType: "regular",
    address: "Jl. Cikoko Barat, Pancoran, Jakarta Selatan",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["JDB1"]
  },
  {
    id: "lrt-jdb-3",
    name: "Pancoran",
    latitude: -6.2553,
    longitude: 106.8522,
    stationType: "regular",
    address: "Jl. MT Haryono, Pancoran, Jakarta Selatan",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt"],
    routeNumbers: ["JDB1"]
  },
  {
    id: "lrt-jdb-4",
    name: "Kuningan",
    latitude: -6.2308,
    longitude: 106.8333,
    stationType: "interchange",
    address: "Jl. HR Rasuna Said, Kuningan, Jakarta Selatan",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "retail"],
    isActive: true,
    transportModes: ["lrt", "transjakarta"],
    routeNumbers: ["JDB1"]
  },
  {
    id: "lrt-jdb-5",
    name: "Rasuna Said",
    latitude: -6.2158,
    longitude: 106.8317,
    stationType: "regular",
    address: "Jl. HR Rasuna Said, Jakarta Selatan",
    facilities: ["elevator", "ticket booth", "disabled access"],
    isActive: true,
    transportModes: ["lrt", "transjakarta"],
    routeNumbers: ["JDB1"]
  },
  {
    id: "lrt-jdb-6",
    name: "Dukuh Atas",
    latitude: -6.2008,
    longitude: 106.8229,
    stationType: "interchange",
    address: "Jl. Jenderal Sudirman, Jakarta Pusat",
    facilities: ["toilet", "elevator", "ticket booth", "disabled access", "prayer room", "retail"],
    isActive: true,
    transportModes: ["lrt", "mrt", "transjakarta", "krl"],
    routeNumbers: ["JDB1"]
  }
];

// Create edges between LRT stations
function generateLRTEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper function to connect stations in sequence
  function connectLRTStations(stationIds: string[], routeNumber: string, color: string) {
    for (let i = 0; i < stationIds.length - 1; i++) {
      edges.push(createLRTEdge(stationIds[i], stationIds[i + 1], routeNumber, color));
    }
  }

  // LRT Jakarta
  connectLRTStations(
    ["lrt-jkt-1", "lrt-jkt-2", "lrt-jkt-3", "lrt-jkt-4", "lrt-jkt-5", "lrt-jkt-6"],
    "LRT1",
    "#ff9800" // Orange
  );

  // LRT Jabodebek
  connectLRTStations(
    ["lrt-jdb-1", "lrt-jdb-2", "lrt-jdb-3", "lrt-jdb-4", "lrt-jdb-5", "lrt-jdb-6"],
    "JDB1",
    "#4caf50" // Green
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

// Helper function to create an LRT edge with calculated distance and estimated travel time
function createLRTEdge(
  sourceId: string,
  targetId: string,
  routeNumber: string,
  color: string
): Edge {
  const sourceNode = lrtStations.find((node) => node.id === sourceId)!;
  const targetNode = lrtStations.find((node) => node.id === targetId)!;

  const distance = calculateDistance(
    sourceNode.latitude,
    sourceNode.longitude,
    targetNode.latitude,
    targetNode.longitude
  );

  // Estimate travel time: assume 1.2 minutes per km + 0.5 minute for station stop
  const weight = Math.round(distance * 1.2) + 0.5;

  // Calculate fare based on distance (simplified model)
  // Base fare 5000 IDR + 1000 IDR per km
  const fare = Math.round(5000 + (distance * 1000));

  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
    corridor: routeNumber,
    color,
    routeNumber,
    isActive: true,
    transportMode: "lrt",
    fare,
    frequency: 7, // 7 minutes between services
    operatingHours: {
      start: "05:00",
      end: "23:00"
    }
  };
}

// Create the LRT graph
export const lrtGraph: Graph = {
  nodes: lrtStations,
  edges: generateLRTEdges()
};
