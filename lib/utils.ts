// @ts-nocheck
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export type Node = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  corridor?: string;
  stationType?: "terminal" | "interchange" | "regular";
  address?: string;
  facilities?: string[];
  isActive?: boolean;
  transportModes?: TransportMode[];
  routeNumbers?: string[];
};

export type Edge = {
  source: string;
  target: string;
  weight: number; // in minutes
  distance: number; // in kilometers
  corridor?: string;
  color?: string;
  routeNumber?: string;
  isActive?: boolean;
  transportMode?: TransportMode;
  fare?: number; // in IDR
  frequency?: number; // in minutes between services
  operatingHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  // OSRM-specific properties for realistic routing
  osrmRoute?: {
    geometry: [number, number][]; // Array of [lng, lat] coordinates for the route
    duration: number; // Duration in seconds from OSRM
    distance: number; // Distance in meters from OSRM
    steps?: OSRMStep[]; // Turn-by-turn instructions
  };
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

// Priority queue implementation for Dijkstra algorithm
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

// Function to calculate the Haversine distance between two points
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// OSRM-related types for realistic routing
export type OSRMStep = {
  geometry: [number, number][];
  maneuver: {
    type: string;
    instruction: string;
    bearing_after?: number;
    bearing_before?: number;
    location: [number, number];
  };
  mode: string;
  driving_side: string;
  name: string;
  intersections: any[];
  weight: number;
  duration: number;
  distance: number;
};

export type OSRMResponse = {
  code: string;
  routes: {
    geometry: string; // Encoded polyline
    legs: {
      steps: OSRMStep[];
      summary: string;
      weight: number;
      duration: number;
      distance: number;
    }[];
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
  }[];
  waypoints: {
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }[];
};

export type RouteSegment = {
  coordinates: [number, number][];
  transportMode: TransportMode;
  routeInfo: {
    name: string;
    color: string;
    routeNumber?: string;
    corridor?: string;
  };
  duration: number; // in minutes
  distance: number; // in kilometers
  instructions?: string[];
};

// Routing mode type for toggle
export type RoutingMode = "straight-line" | "osrm-realistic";
