import { Graph, Node, Edge, calculateDistance } from '@/lib/utils';

// Simplified TransJakarta stations data
// In a real application, this would be fetched from an API or database
const stations: Node[] = [
  { id: "1", name: "Blok M", latitude: -6.2445, longitude: 106.7982 },
  { id: "2", name: "Masjid Agung", latitude: -6.2402, longitude: 106.7975 },
  { id: "3", name: "Bundaran Senayan", latitude: -6.2273, longitude: 106.8027 },
  { id: "4", name: "Gelora Bung Karno", latitude: -6.2180, longitude: 106.8023 },
  { id: "5", name: "Dukuh Atas", latitude: -6.2008, longitude: 106.8229 },
  { id: "6", name: "Sarinah", latitude: -6.1873, longitude: 106.8242 },
  { id: "7", name: "Monas", latitude: -6.1751, longitude: 106.8272 },
  { id: "8", name: "Harmoni", latitude: -6.1658, longitude: 106.8159 },
  { id: "9", name: "Glodok", latitude: -6.1455, longitude: 106.8185 },
  { id: "10", name: "Kota", latitude: -6.1375, longitude: 106.8129 },
  { id: "11", name: "Thamrin", latitude: -6.1933, longitude: 106.8236 },
  { id: "12", name: "Tosari ICBC", latitude: -6.1900, longitude: 106.8229 },
  { id: "13", name: "Bunderan HI", latitude: -6.1950, longitude: 106.8230 },
  { id: "14", name: "Sawah Besar", latitude: -6.1608, longitude: 106.8274 },
  { id: "15", name: "Mangga Besar", latitude: -6.1494, longitude: 106.8261 },
  { id: "16", name: "Olimo", latitude: -6.1399, longitude: 106.8223 },
  { id: "17", name: "Pejompongan", latitude: -6.2040, longitude: 106.7989 },
  { id: "18", name: "Kuningan", latitude: -6.2238, longitude: 106.8302 },
  { id: "19", name: "Cawang", latitude: -6.2425, longitude: 106.8714 },
  { id: "20", name: "Pulogadung", latitude: -6.1841, longitude: 106.8993 },
];

// Create edges between stations
// In a real app, you would have actual route connections and measured times
function generateEdges(): Edge[] {
  const edges: Edge[] = [];

  // Create connections between stations with calculated distances
  // Corridor 1: Blok M to Kota
  edges.push(createEdge("1", "2"));
  edges.push(createEdge("2", "3"));
  edges.push(createEdge("3", "4"));
  edges.push(createEdge("4", "5"));
  edges.push(createEdge("5", "6"));
  edges.push(createEdge("6", "7"));
  edges.push(createEdge("7", "8"));
  edges.push(createEdge("8", "9"));
  edges.push(createEdge("9", "10"));

  // Some connections for Corridor 2
  edges.push(createEdge("5", "11"));
  edges.push(createEdge("11", "12"));
  edges.push(createEdge("12", "13"));
  edges.push(createEdge("5", "13"));

  // Some connections for Corridor 3
  edges.push(createEdge("7", "14"));
  edges.push(createEdge("14", "15"));
  edges.push(createEdge("15", "16"));

  // Other corridors
  edges.push(createEdge("4", "17"));
  edges.push(createEdge("5", "18"));
  edges.push(createEdge("18", "19"));
  edges.push(createEdge("19", "20"));

  // Make connections bidirectional
  const bidirectionalEdges = [...edges];
  edges.forEach(edge => {
    bidirectionalEdges.push({
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
      distance: edge.distance,
    });
  });

  return bidirectionalEdges;
}

// Helper function to create an edge with calculated distance and estimated travel time
function createEdge(sourceId: string, targetId: string): Edge {
  const sourceNode = stations.find(node => node.id === sourceId)!;
  const targetNode = stations.find(node => node.id === targetId)!;
  
  const distance = calculateDistance(
    sourceNode.latitude, sourceNode.longitude,
    targetNode.latitude, targetNode.longitude
  );
  
  // Estimate travel time: assume 2 minutes per km + 1 minute for station stop
  const weight = Math.round(distance * 2) + 1;
  
  return {
    source: sourceId,
    target: targetId,
    weight,
    distance,
  };
}

// Create the TransJakarta network graph
export const transjakartaGraph: Graph = {
  nodes: stations,
  edges: generateEdges(),
};

// Get node by ID
export function getNodeById(id: string): Node | undefined {
  return stations.find(node => node.id === id);
}

// Get all stations
export function getAllStations(): Node[] {
  return stations;
}