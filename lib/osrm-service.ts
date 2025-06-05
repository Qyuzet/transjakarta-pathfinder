// @ts-nocheck
import { OSRMResponse, OSRMStep, Node } from "./utils";

// OSRM API configuration
const OSRM_BASE_URL = "https://router.project-osrm.org";

// Cache for OSRM responses to avoid repeated API calls
const osrmCache = new Map<string, any>();

/**
 * Decode polyline geometry from OSRM response
 * This is a simplified version of the polyline decoding algorithm
 */
export function decodePolyline(encoded: string): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    // Leaflet uses [lat, lng] format, so we swap the coordinates
    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}

/**
 * Get route between two points using OSRM API
 */
export async function getOSRMRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<{
  geometry: [number, number][];
  duration: number; // in seconds
  distance: number; // in meters
  steps?: OSRMStep[];
} | null> {
  // Create cache key
  const cacheKey = `${startLat},${startLng}-${endLat},${endLng}-${profile}`;
  
  // Check cache first
  if (osrmCache.has(cacheKey)) {
    return osrmCache.get(cacheKey);
  }

  try {
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=polyline&steps=true`;

    console.log("Fetching OSRM route from:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log("OSRM response status:", response.status);

    if (!response.ok) {
      console.warn(`OSRM API error: ${response.status}`);
      return null;
    }

    const data: OSRMResponse = await response.json();
    console.log("OSRM response data:", data);

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.warn("No route found by OSRM");
      return null;
    }

    const route = data.routes[0];
    const geometry = decodePolyline(route.geometry);
    
    // Extract steps from the first leg
    const steps = route.legs[0]?.steps || [];
    
    const result = {
      geometry,
      duration: route.duration,
      distance: route.distance,
      steps,
    };

    // Cache the result
    osrmCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error fetching OSRM route:", error);
    return null;
  }
}

/**
 * Get route between multiple waypoints using OSRM API
 */
export async function getOSRMRouteMultiple(
  waypoints: { lat: number; lng: number }[],
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<{
  geometry: [number, number][];
  duration: number;
  distance: number;
  legs: {
    geometry: [number, number][];
    duration: number;
    distance: number;
    steps: OSRMStep[];
  }[];
} | null> {
  if (waypoints.length < 2) {
    return null;
  }

  // Create cache key for multiple waypoints
  const cacheKey = `multi-${waypoints.map(w => `${w.lat},${w.lng}`).join(';')}-${profile}`;
  
  if (osrmCache.has(cacheKey)) {
    return osrmCache.get(cacheKey);
  }

  try {
    const coordinates = waypoints.map(w => `${w.lng},${w.lat}`).join(';');
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coordinates}?overview=full&geometries=polyline&steps=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`OSRM API error: ${response.status}`);
      return null;
    }

    const data: OSRMResponse = await response.json();
    
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.warn("No route found by OSRM");
      return null;
    }

    const route = data.routes[0];
    const geometry = decodePolyline(route.geometry);
    
    // Process each leg
    const legs = route.legs.map(leg => ({
      geometry: leg.steps.flatMap(step => step.geometry),
      duration: leg.duration,
      distance: leg.distance,
      steps: leg.steps,
    }));
    
    const result = {
      geometry,
      duration: route.duration,
      distance: route.distance,
      legs,
    };

    // Cache the result
    osrmCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error fetching OSRM multi-route:", error);
    return null;
  }
}

/**
 * Get realistic route for a path of stations using OSRM
 */
export async function getRealisticRouteForPath(
  stations: Node[],
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<{
  totalGeometry: [number, number][];
  totalDuration: number; // in minutes
  totalDistance: number; // in kilometers
  segments: {
    from: string;
    to: string;
    geometry: [number, number][];
    duration: number; // in minutes
    distance: number; // in kilometers
    instructions: string[];
  }[];
} | null> {
  if (stations.length < 2) {
    console.log("Not enough stations for OSRM routing");
    return null;
  }

  console.log(`Getting OSRM route for ${stations.length} stations with profile: ${profile}`);

  const segments = [];
  let totalGeometry: [number, number][] = [];
  let totalDuration = 0;
  let totalDistance = 0;

  // Get route for each segment
  for (let i = 0; i < stations.length - 1; i++) {
    const fromStation = stations[i];
    const toStation = stations[i + 1];

    console.log(`Getting OSRM route from ${fromStation.name} to ${toStation.name}`);

    const osrmRoute = await getOSRMRoute(
      fromStation.latitude,
      fromStation.longitude,
      toStation.latitude,
      toStation.longitude,
      profile
    );

    if (osrmRoute) {
      console.log(`OSRM route found: ${osrmRoute.geometry.length} coordinates, ${osrmRoute.duration}s, ${osrmRoute.distance}m`);

      const segmentDuration = osrmRoute.duration / 60; // Convert to minutes
      const segmentDistance = osrmRoute.distance / 1000; // Convert to kilometers

      // Extract turn-by-turn instructions
      console.log("🔍 OSRM steps for segment:", osrmRoute.steps);
      const instructions = osrmRoute.steps?.map((step, index) => {
        console.log(`Step ${index}:`, step);
        // Try different instruction formats
        const instruction = step.maneuver?.instruction ||
                          step.instruction ||
                          step.name ||
                          `${step.maneuver?.type || 'continue'} ${step.maneuver?.modifier ? 'and ' + step.maneuver.modifier : ''}`.trim();
        console.log(`Extracted instruction: "${instruction}"`);
        return instruction;
      }).filter(Boolean) || [];

      console.log("Final instructions for segment:", instructions);

      segments.push({
        from: fromStation.id,
        to: toStation.id,
        geometry: osrmRoute.geometry,
        duration: segmentDuration,
        distance: segmentDistance,
        instructions,
      });

      // Add to total geometry (avoid duplicating connection points)
      if (totalGeometry.length === 0) {
        totalGeometry = [...osrmRoute.geometry];
      } else {
        totalGeometry = [...totalGeometry, ...osrmRoute.geometry.slice(1)];
      }

      totalDuration += segmentDuration;
      totalDistance += segmentDistance;
    } else {
      console.log(`OSRM route failed for ${fromStation.name} to ${toStation.name}, using fallback`);

      // Fallback to straight line if OSRM fails
      // Leaflet uses [lat, lng] format
      const straightLine: [number, number][] = [
        [fromStation.latitude, fromStation.longitude],
        [toStation.latitude, toStation.longitude],
      ];

      segments.push({
        from: fromStation.id,
        to: toStation.id,
        geometry: straightLine,
        duration: 5, // Fallback duration
        distance: 2, // Fallback distance
        instructions: [`Go from ${fromStation.name} to ${toStation.name}`],
      });

      if (totalGeometry.length === 0) {
        totalGeometry = [...straightLine];
      } else {
        totalGeometry = [...totalGeometry, ...straightLine.slice(1)];
      }

      totalDuration += 5;
      totalDistance += 2;
    }
  }

  console.log(`OSRM routing complete: ${segments.length} segments, ${totalGeometry.length} total coordinates`);

  return {
    totalGeometry,
    totalDuration,
    totalDistance,
    segments,
  };
}

/**
 * Clear OSRM cache (useful for development)
 */
export function clearOSRMCache(): void {
  osrmCache.clear();
}

/**
 * Get cache statistics
 */
export function getOSRMCacheStats(): { size: number; keys: string[] } {
  return {
    size: osrmCache.size,
    keys: Array.from(osrmCache.keys()),
  };
}
