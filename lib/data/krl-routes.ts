// @ts-nocheck
import { Graph, Node, Edge, TransportMode, calculateDistance } from "@/lib/utils";

// KRL Commuter Line routes data for Jabodetabek area
// In a real application, this would be fetched from an API or database
const krlStations: Node[] = [
  // Bogor Line (Red)
  {
    id: "krl-red-1",
    name: "Jakarta Kota",
    latitude: -6.1375,
    longitude: 106.8129,
    stationType: "terminal",
    address: "Jl. Lada, Kota Tua, Jakarta Barat",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-2",
    name: "Jayakarta",
    latitude: -6.1408,
    longitude: 106.8178,
    stationType: "regular",
    address: "Jl. Jayakarta, Jakarta Pusat",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-3",
    name: "Mangga Besar",
    latitude: -6.1494,
    longitude: 106.8261,
    stationType: "regular",
    address: "Jl. Mangga Besar, Jakarta Barat",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-4",
    name: "Sawah Besar",
    latitude: -6.1608,
    longitude: 106.8274,
    stationType: "regular",
    address: "Jl. Sawah Besar, Jakarta Pusat",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-5",
    name: "Juanda",
    latitude: -6.1667,
    longitude: 106.83,
    stationType: "interchange",
    address: "Jl. Ir. H. Juanda, Jakarta Pusat",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Red", "Yellow"]
  },
  {
    id: "krl-red-6",
    name: "Gambir",
    latitude: -6.1767,
    longitude: 106.8306,
    stationType: "interchange",
    address: "Jl. Medan Merdeka Timur, Jakarta Pusat",
    facilities: ["toilet", "ticket booth", "waiting room", "retail", "restaurant"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-7",
    name: "Gondangdia",
    latitude: -6.1867,
    longitude: 106.8306,
    stationType: "regular",
    address: "Jl. Srikaya, Gondangdia, Jakarta Pusat",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-8",
    name: "Cikini",
    latitude: -6.1967,
    longitude: 106.8361,
    stationType: "regular",
    address: "Jl. Cikini Raya, Jakarta Pusat",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-9",
    name: "Manggarai",
    latitude: -6.2097,
    longitude: 106.8503,
    stationType: "interchange",
    address: "Jl. Sultan Agung, Manggarai, Jakarta Selatan",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red", "Blue", "Yellow", "Green"]
  },
  {
    id: "krl-red-10",
    name: "Tebet",
    latitude: -6.2261,
    longitude: 106.8575,
    stationType: "regular",
    address: "Jl. Tebet Barat Dalam, Jakarta Selatan",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-11",
    name: "Cawang",
    latitude: -6.2422,
    longitude: 106.8658,
    stationType: "regular",
    address: "Jl. Dewi Sartika, Cawang, Jakarta Timur",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-12",
    name: "Duren Kalibata",
    latitude: -6.2556,
    longitude: 106.8556,
    stationType: "regular",
    address: "Jl. Duren Kalibata, Jakarta Selatan",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-13",
    name: "Pasar Minggu",
    latitude: -6.2844,
    longitude: 106.8444,
    stationType: "regular",
    address: "Jl. Raya Pasar Minggu, Jakarta Selatan",
    facilities: ["ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-14",
    name: "Depok",
    latitude: -6.4,
    longitude: 106.8186,
    stationType: "interchange",
    address: "Jl. Stasiun Depok Baru, Depok",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Red"]
  },
  {
    id: "krl-red-15",
    name: "Bogor",
    latitude: -6.6,
    longitude: 106.7917,
    stationType: "terminal",
    address: "Jl. Nyi Raja Permas, Bogor",
    facilities: ["toilet", "ticket booth", "waiting room", "retail", "restaurant"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red"]
  },

  // Bekasi Line (Blue)
  {
    id: "krl-blue-1",
    name: "Manggarai",
    latitude: -6.2097,
    longitude: 106.8503,
    stationType: "interchange",
    address: "Jl. Sultan Agung, Manggarai, Jakarta Selatan",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Red", "Blue", "Yellow", "Green"]
  },
  {
    id: "krl-blue-2",
    name: "Jatinegara",
    latitude: -6.2147,
    longitude: 106.8706,
    stationType: "interchange",
    address: "Jl. Jatinegara Timur, Jakarta Timur",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Blue", "Yellow"]
  },
  {
    id: "krl-blue-3",
    name: "Klender",
    latitude: -6.2133,
    longitude: 106.9003,
    stationType: "regular",
    address: "Jl. Bekasi Timur Raya, Jakarta Timur",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Blue"]
  },
  {
    id: "krl-blue-4",
    name: "Buaran",
    latitude: -6.2147,
    longitude: 106.9256,
    stationType: "regular",
    address: "Jl. Raden Inten, Jakarta Timur",
    facilities: ["ticket booth", "waiting room"],
    isActive: true,
    transportModes: ["krl"],
    routeNumbers: ["Blue"]
  },
  {
    id: "krl-blue-5",
    name: "Bekasi",
    latitude: -6.2361,
    longitude: 107.0056,
    stationType: "terminal",
    address: "Jl. Ir. H. Juanda, Bekasi",
    facilities: ["toilet", "ticket booth", "waiting room", "retail"],
    isActive: true,
    transportModes: ["krl", "transjakarta"],
    routeNumbers: ["Blue"]
  }
];

// Create edges between KRL stations
function generateKRLEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper function to connect stations in sequence
  function connectKRLStations(stationIds: string[], routeNumber: string, color: string) {
    for (let i = 0; i < stationIds.length - 1; i++) {
      edges.push(createKRLEdge(stationIds[i], stationIds[i + 1], routeNumber, color));
    }
  }

  // Bogor Line (Red)
  connectKRLStations(
    [
      "krl-red-1", "krl-red-2", "krl-red-3", "krl-red-4", "krl-red-5", 
      "krl-red-6", "krl-red-7", "krl-red-8", "krl-red-9", "krl-red-10", 
      "krl-red-11", "krl-red-12", "krl-red-13", "krl-red-14", "krl-red-15"
    ],
    "Red",
    "#e53935" // Red
  );

  // Bekasi Line (Blue)
  connectKRLStations(
    ["krl-blue-1", "krl-blue-2", "krl-blue-3", "krl-blue-4", "krl-blue-5"],
    "Blue",
    "#1e88e5" // Blue
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

// Helper function to create a KRL edge with calculated distance and estimated travel time
function createKRLEdge(
  sourceId: string,
  targetId: string,
  routeNumber: string,
  color: string
): Edge {
  const sourceNode = krlStations.find((node) => node.id === sourceId)!;
  const targetNode = krlStations.find((node) => node.id === targetId)!;

  const distance = calculateDistance(
    sourceNode.latitude,
    sourceNode.longitude,
    targetNode.latitude,
    targetNode.longitude
  );

  // Estimate travel time: assume 1.5 minutes per km + 1 minute for station stop
  const weight = Math.round(distance * 1.5) + 1;

  // Calculate fare based on distance (simplified model)
  // Base fare 3000 IDR + 500 IDR per km
  const fare = Math.round(3000 + (distance * 500));

  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
    corridor: routeNumber,
    color,
    routeNumber,
    isActive: true,
    transportMode: "krl",
    fare,
    frequency: 15, // 15 minutes between services
    operatingHours: {
      start: "04:00",
      end: "24:00"
    }
  };
}

// Create the KRL graph
export const krlGraph: Graph = {
  nodes: krlStations,
  edges: generateKRLEdges()
};
