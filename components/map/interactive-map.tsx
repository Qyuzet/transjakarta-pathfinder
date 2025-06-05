"use client";
// @ts-nocheck

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import {
  combinedTransportGraph,
  transjakartaGraph,
  jaklingkoGraph,
  mrtGraph,
  krlGraph,
  lrtGraph,
  getTransportModeColor,
  getTransportModeIcon,
  getCorridorColor,
} from "@/lib/data/combined-transport";

import { Node, Edge, TransportMode, RoutingMode, RouteSegment } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bus, Map, X, Train, Car, Route, MapPin } from "lucide-react";

// Using getCorridorColor imported from combined-transport.ts

// Default Jakarta center coordinates
const JAKARTA_CENTER = { lat: -6.1944, lng: 106.8229 };
const DEFAULT_ZOOM = 12;

type MapProps = {
  selectedPath?: string[];
  startNodeId?: string;
  endNodeId?: string;
  comparisonMode?: boolean;
  dijkstraPath?: string[];
  bfsPath?: string[];
  routingMode?: RoutingMode;
  routeSegments?: RouteSegment[];
  routeMetrics?: any;
};

// Helper function to get a node by ID from the combined graph
function getNodeById(nodeId: string): Node | undefined {
  return combinedTransportGraph.nodes.find((node) => node.id === nodeId);
}

// Custom center component to update map view when path changes
function SetViewOnPath({
  path,
  startNodeId,
  endNodeId,
  comparisonMode,
  dijkstraPath,
  bfsPath,
}: {
  path: string[];
  startNodeId?: string;
  endNodeId?: string;
  comparisonMode?: boolean;
  dijkstraPath?: string[];
  bfsPath?: string[];
}) {
  const map = useMap();

  useEffect(() => {
    if (startNodeId && endNodeId) {
      // Create bounds from the path
      const startNode = getNodeById(startNodeId);
      const endNode = getNodeById(endNodeId);

      if (startNode && endNode) {
        const bounds = [
          [startNode.latitude, startNode.longitude],
          [endNode.latitude, endNode.longitude],
        ];

        // If in comparison mode and paths are different, include all points in the bounds
        if (comparisonMode && dijkstraPath && bfsPath) {
          const allPoints: [number, number][] = [
            [startNode.latitude, startNode.longitude],
            [endNode.latitude, endNode.longitude],
          ];

          // Add all points from both paths to create a more comprehensive bound
          [...dijkstraPath, ...bfsPath].forEach((nodeId) => {
            const node = getNodeById(nodeId);
            if (node) {
              allPoints.push([node.latitude, node.longitude]);
            }
          });

          if (allPoints.length > 2) {
            map.fitBounds(allPoints as any);
            return;
          }
        }

        map.fitBounds(bounds as any);
      }
    } else {
      map.setView(JAKARTA_CENTER, DEFAULT_ZOOM);
    }
  }, [
    map,
    path,
    startNodeId,
    endNodeId,
    comparisonMode,
    dijkstraPath,
    bfsPath,
  ]);

  return null;
}

export function InteractiveMap({
  selectedPath = [],
  startNodeId,
  endNodeId,
  comparisonMode = false,
  dijkstraPath = [],
  bfsPath = [],
  routingMode = "straight-line",
  routeSegments = [],
  routeMetrics = null,
}: MapProps) {
  const [showLegend, setShowLegend] = useState(false);
  // Get path coordinates for the polyline
  const pathCoordinates = selectedPath
    .map((nodeId) => {
      const node = getNodeById(nodeId);
      return node ? [node.latitude, node.longitude] : null;
    })
    .filter(Boolean) as [number, number][];

  // Get path coordinates for Dijkstra in comparison mode
  const dijkstraCoordinates = comparisonMode
    ? (dijkstraPath
        .map((nodeId) => {
          const node = getNodeById(nodeId);
          return node ? [node.latitude, node.longitude] : null;
        })
        .filter(Boolean) as [number, number][])
    : [];

  // Get path coordinates for BFS in comparison mode
  const bfsCoordinates = comparisonMode
    ? (bfsPath
        .map((nodeId) => {
          const node = getNodeById(nodeId);
          return node ? [node.latitude, node.longitude] : null;
        })
        .filter(Boolean) as [number, number][])
    : [];

  // Create custom icons based on station type and transport mode
  const getStationIcon = (node: Node) => {
    // If it's the start or end node, use special icons
    if (node.id === startNodeId) {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: #10b981;">
          <div class="marker-label">A</div>
          <div class="marker-details">Start</div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    } else if (node.id === endNodeId) {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: #ef4444;">
          <div class="marker-label">B</div>
          <div class="marker-details">End</div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    }

    // Otherwise, use icons based on station type and transport mode
    const stationType = node.stationType || "regular";

    // Determine primary transport mode and color
    let primaryMode: TransportMode = "transjakarta";
    let primaryColor = "#6366f1"; // Default color

    if (node.transportModes && node.transportModes.length > 0) {
      // Use the first transport mode as primary
      primaryMode = node.transportModes[0];
      primaryColor = getTransportModeColor(primaryMode);
    } else if (node.corridor) {
      // Fallback to corridor color for TransJakarta
      primaryColor = getCorridorColor(node.corridor);
    }

    // Create a short name for the station (first letter of each word)
    const shortName = node.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Create route/corridor label
    let routeLabel = "";
    if (node.corridor) {
      routeLabel = `C${node.corridor}`;
    } else if (node.routeNumbers && node.routeNumbers.length > 0) {
      routeLabel = node.routeNumbers[0];
    }

    // Get transport mode icon
    const modeIcon = getTransportModeIcon(primaryMode);

    // Create different icons based on station type
    if (stationType === "terminal") {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${primaryColor}; border: 2px solid white;">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            ${modeIcon}
            ${routeLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    } else if (stationType === "interchange") {
      // For interchange stations, show multiple transport modes if available
      let modeIcons = modeIcon;
      if (node.transportModes && node.transportModes.length > 1) {
        // Show up to 2 transport mode icons
        modeIcons = node.transportModes
          .slice(0, 2)
          .map((mode) => getTransportModeIcon(mode))
          .join("");
      }

      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${primaryColor}; border: 2px solid white;">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            ${modeIcons}
            ${routeLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    } else {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${primaryColor};">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            ${modeIcon}
            ${routeLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    }
  };

  // Using getCorridorColor from the imports

  // Function to render enhanced route segments (OSRM or straight-line)
  const renderEnhancedRouteSegments = () => {
    if (!routeSegments || routeSegments.length === 0) {
      console.log("No route segments to render");
      return null;
    }

    console.log("Rendering enhanced route segments:", routeSegments.length, "segments");
    console.log("Routing mode:", routingMode);
    console.log("First segment coordinates:", routeSegments[0]?.coordinates?.length, "points");

    return (
      <>
        {routeSegments.map((segment, index) => (
          <Polyline
            key={`enhanced-segment-${index}`}
            positions={segment.coordinates}
            color={segment.routeInfo.color}
            weight={routingMode === "osrm-realistic" ? 6 : 5}
            opacity={0.9}
            dashArray={segment.routeInfo.routeNumber === "Transfer" ? "10,5" : ""}
            className="enhanced-route"
          >
            <Popup>
              <div className="p-2">
                <h3 className="text-xs font-medium">
                  {segment.routeInfo.name}
                </h3>
                <p className="text-[10px] mt-1">
                  Mode: {routingMode === "osrm-realistic" ? "Realistic Roads" : "Straight Line"}
                </p>
                <p className="text-[10px]">
                  Duration: {segment.duration.toFixed(1)} minutes
                </p>
                <p className="text-[10px]">
                  Distance: {segment.distance.toFixed(2)} km
                </p>
                {segment.instructions && segment.instructions.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-medium">Instructions:</p>
                    {segment.instructions.slice(0, 3).map((instruction, idx) => (
                      <p key={idx} className="text-[9px] text-muted-foreground">
                        • {instruction}
                      </p>
                    ))}
                    {segment.instructions.length > 3 && (
                      <p className="text-[9px] text-muted-foreground">
                        ... and {segment.instructions.length - 3} more
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Polyline>
        ))}
      </>
    );
  };

  // Function to render transport-specific route segments (fallback for straight-line)
  const renderCorridorSpecificRoutes = (path: string[]) => {
    if (path.length < 2) return null;

    // Group path segments by transport mode and corridor/route
    const transportSegments: Record<
      string,
      {
        start: string;
        end: string;
        coords: [number, number][];
        transportMode?: TransportMode;
        routeNumber?: string;
        edge: Edge;
      }[]
    > = {};

    // Process each segment in the path
    for (let i = 0; i < path.length - 1; i++) {
      const sourceId = path[i];
      const targetId = path[i + 1];

      // Find the edge between these nodes in the combined graph
      const edge = combinedTransportGraph.edges.find(
        (e) => e.source === sourceId && e.target === targetId
      );

      if (!edge) continue;

      // Get the transport mode and route/corridor identifier
      const transportMode = edge.transportMode || "transjakarta";
      const routeId = edge.corridor || edge.routeNumber || "unknown";

      // Create a unique key for this transport mode + route combination
      const segmentKey = `${transportMode}-${routeId}`;

      // Get coordinates for this segment
      const sourceNode = getNodeById(sourceId);
      const targetNode = getNodeById(targetId);

      if (!sourceNode || !targetNode) continue;

      const coords: [number, number][] = [
        [sourceNode.latitude, sourceNode.longitude],
        [targetNode.latitude, targetNode.longitude],
      ];

      // Add to transport segments
      if (!transportSegments[segmentKey]) {
        transportSegments[segmentKey] = [];
      }

      transportSegments[segmentKey].push({
        start: sourceId,
        end: targetId,
        coords,
        transportMode,
        routeNumber: routeId,
        edge,
      });
    }

    // Render each transport mode's segments with appropriate styling
    return (
      <>
        {Object.entries(transportSegments).map(([segmentKey, segments]) => {
          // Get the first segment to determine styling
          const firstSegment = segments[0];
          const transportMode = firstSegment.transportMode || "transjakarta";
          const routeId = firstSegment.routeNumber || "unknown";

          // Determine color based on transport mode and route
          let color = "#6366f1"; // Default color
          if (transportMode === "transjakarta" && routeId !== "unknown") {
            color = getCorridorColor(routeId);
          } else {
            color = getTransportModeColor(transportMode);
          }

          return (
            <React.Fragment key={segmentKey}>
              {segments.map((segment, index) => (
                <Polyline
                  key={`${segmentKey}-${segment.start}-${segment.end}-${index}`}
                  positions={segment.coords}
                  color={color}
                  weight={5}
                  opacity={0.8}
                  dashArray={routeId === "unknown" ? "5,5" : ""}
                  className="transport-route"
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="text-xs font-medium">
                        {transportMode.charAt(0).toUpperCase() +
                          transportMode.slice(1)}
                        {routeId !== "unknown" ? ` ${routeId}` : ""}
                      </h3>
                      <p className="text-[10px] mt-1">
                        From:{" "}
                        {getNodeById(segment.start)?.name || segment.start}
                      </p>
                      <p className="text-[10px]">
                        To: {getNodeById(segment.end)?.name || segment.end}
                      </p>
                      {segment.edge.distance && (
                        <p className="text-[10px] mt-1">
                          Distance: {segment.edge.distance.toFixed(2)} km
                        </p>
                      )}
                      {segment.edge.weight && (
                        <p className="text-[10px]">
                          Travel time: {segment.edge.weight} min
                        </p>
                      )}
                      {segment.edge.fare && (
                        <p className="text-[10px]">
                          Fare: Rp {segment.edge.fare.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              ))}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-md border relative">
      {/* Legend Toggle Button */}
      <Button
        size="sm"
        variant="outline"
        className="absolute bottom-2 left-2 z-[1000] h-8 gap-1"
        onClick={() => setShowLegend(!showLegend)}
      >
        {showLegend ? (
          <>
            <X className="h-4 w-4" /> Hide Legend
          </>
        ) : (
          <>
            <Map className="h-4 w-4" /> Show Legend
          </>
        )}
      </Button>

      {/* Map Legend */}
      {showLegend && (
        <div className="absolute bottom-12 left-2 z-[1000] bg-white/90 dark:bg-gray-900/90 p-2 rounded-md shadow-md border max-w-[250px] text-xs overflow-y-auto max-h-[80vh]">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">Jabodetabek Transport Legend</h4>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0"
              onClick={() => setShowLegend(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Station Types */}
          <div className="space-y-1">
            <h5 className="font-medium text-[10px] uppercase mt-2 mb-1">
              Station Types
            </h5>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#10b981] flex items-center justify-center text-white text-[8px] font-bold">
                A
              </div>
              <span>Start Station</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#ef4444] flex items-center justify-center text-white text-[8px] font-bold">
                B
              </div>
              <span>End Station</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-md border-2 border-white flex items-center justify-center text-white text-[8px] font-bold"
                style={{ backgroundColor: getCorridorColor("1") }}
              >
                T1
              </div>
              <span>Terminal Station</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-md border-2 border-white flex items-center justify-center text-white text-[8px] font-bold"
                style={{ backgroundColor: getCorridorColor("2") }}
              >
                IC
              </div>
              <span>Interchange Station</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-md flex items-center justify-center text-white text-[8px] font-bold"
                style={{ backgroundColor: getCorridorColor("3") }}
              >
                RS
              </div>
              <span>Regular Station</span>
            </div>
          </div>

          {/* Routing Mode */}
          <div className="mt-2 pt-1 border-t">
            <h5 className="font-medium text-[10px] uppercase mt-1 mb-1">
              Routing Mode
            </h5>
            <div className="flex items-center gap-1">
              {routingMode === "osrm-realistic" ? (
                <>
                  <Route className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Realistic Roads (OSRM)</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600">Straight Line</span>
                </>
              )}
            </div>
            {routeMetrics && (
              <div className="mt-1 text-[9px] text-muted-foreground">
                <p>Total: {routeMetrics.totalDuration.toFixed(1)}min, {routeMetrics.totalDistance.toFixed(2)}km</p>
                <p>Segments: {routeMetrics.segmentCount}</p>
              </div>
            )}
          </div>

          {/* Transport Modes */}
          <div className="mt-2 pt-1 border-t">
            <h5 className="font-medium text-[10px] uppercase mt-1 mb-1">
              Transport Modes
            </h5>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-full"
                  style={{
                    backgroundColor: getTransportModeColor("transjakarta"),
                  }}
                ></div>
                <span>TransJakarta</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-full"
                  style={{
                    backgroundColor: getTransportModeColor("jaklingko"),
                  }}
                ></div>
                <span>JakLingko</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-full"
                  style={{ backgroundColor: getTransportModeColor("mrt") }}
                ></div>
                <span>MRT Jakarta</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-full"
                  style={{ backgroundColor: getTransportModeColor("krl") }}
                ></div>
                <span>KRL Commuter Line</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-full"
                  style={{ backgroundColor: getTransportModeColor("lrt") }}
                ></div>
                <span>LRT Jakarta</span>
              </div>
            </div>
          </div>

          {/* TransJakarta Corridors */}
          <div className="mt-2 pt-1 border-t">
            <h5 className="font-medium text-[10px] uppercase mt-1 mb-1">
              TransJakarta Corridors
            </h5>
            <div className="grid grid-cols-2 gap-1">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                (corridor) => (
                  <div key={corridor} className="flex items-center gap-1">
                    <div
                      className="w-3 h-1 rounded-full"
                      style={{ backgroundColor: getCorridorColor(corridor) }}
                    ></div>
                    <span>Corridor {corridor}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* JakLingko Routes */}
          <div className="mt-2 pt-1 border-t">
            <h5 className="font-medium text-[10px] uppercase mt-1 mb-1">
              JakLingko Routes
            </h5>
            <div className="grid grid-cols-2 gap-1">
              {["JAK01", "JAK02", "JAK03", "JAK04"].map((route) => (
                <div key={route} className="flex items-center gap-1">
                  <div
                    className="w-3 h-1 rounded-full"
                    style={{ backgroundColor: "#FF9800" }}
                  ></div>
                  <span>{route}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={JAKARTA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Layer controls for corridors */}
        <LayersControl position="topright">
          {/* Base map layers */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OpenStreetMap.HOT">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Transport Mode Layers */}
          {/* TransJakarta Corridors */}
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
            (corridor) => (
              <LayersControl.Overlay
                key={`tj-${corridor}`}
                name={`TransJakarta Corridor ${corridor}`}
                checked={!startNodeId && !endNodeId} // Only show by default if no path is selected
              >
                <LayerGroup>
                  {transjakartaGraph.nodes
                    .filter((node) => node.corridor === corridor)
                    .map((node) => (
                      <Marker
                        key={`overlay-tj-${node.id}`}
                        position={[node.latitude, node.longitude]}
                        icon={getStationIcon(node)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">{node.name}</h3>
                            <div
                              className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                              style={{
                                backgroundColor:
                                  getCorridorColor(corridor) + "20",
                                color: getCorridorColor(corridor),
                              }}
                            >
                              Corridor {corridor}
                            </div>
                            {node.stationType && (
                              <p className="text-xs mt-1 capitalize">
                                Type: {node.stationType}
                              </p>
                            )}
                            {node.address && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {node.address}
                              </p>
                            )}
                            {node.facilities && node.facilities.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium">
                                  Facilities:
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {node.facilities.map((facility, index) => (
                                    <span
                                      key={index}
                                      className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                                      style={{
                                        backgroundColor:
                                          getCorridorColor(corridor) + "20",
                                        color: getCorridorColor(corridor),
                                      }}
                                    >
                                      {facility}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {/* Draw corridor routes */}
                  {transjakartaGraph.edges
                    .filter((edge) => edge.corridor === corridor)
                    .map((edge, index) => {
                      const sourceNode = getNodeById(edge.source);
                      const targetNode = getNodeById(edge.target);

                      if (!sourceNode || !targetNode) return null;

                      const coords: [number, number][] = [
                        [sourceNode.latitude, sourceNode.longitude],
                        [targetNode.latitude, targetNode.longitude],
                      ];

                      return (
                        <Polyline
                          key={`corridor-${corridor}-edge-${index}`}
                          positions={coords}
                          color={getCorridorColor(corridor)}
                          weight={3}
                          opacity={0.6}
                          className="corridor-route"
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="text-xs font-medium">
                                Corridor {corridor}
                              </h3>
                              <p className="text-[10px] mt-1">
                                From: {sourceNode.name}
                              </p>
                              <p className="text-[10px]">
                                To: {targetNode.name}
                              </p>
                              <p className="text-[10px] mt-1">
                                Distance: {edge.distance.toFixed(2)} km
                              </p>
                              <p className="text-[10px]">
                                Travel time: {edge.weight} min
                              </p>
                            </div>
                          </Popup>
                        </Polyline>
                      );
                    })}
                </LayerGroup>
              </LayersControl.Overlay>
            )
          )}
          {/* JakLingko Routes */}
          {["JAK01", "JAK02", "JAK03", "JAK04"].map((route) => (
            <LayersControl.Overlay
              key={`jl-${route}`}
              name={`JakLingko Route ${route}`}
              checked={false}
            >
              <LayerGroup>
                {jaklingkoGraph.nodes
                  .filter((node) => node.routeNumbers?.includes(route))
                  .map((node) => (
                    <Marker
                      key={`overlay-jl-${node.id}`}
                      position={[node.latitude, node.longitude]}
                      icon={getStationIcon(node)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{node.name}</h3>
                          <div
                            className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                            style={{
                              backgroundColor:
                                getTransportModeColor("jaklingko") + "20",
                              color: getTransportModeColor("jaklingko"),
                            }}
                          >
                            JakLingko {route}
                          </div>
                          {node.stationType && (
                            <p className="text-xs mt-1 capitalize">
                              Type: {node.stationType}
                            </p>
                          )}
                          {node.address && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {node.address}
                            </p>
                          )}
                          {node.facilities && node.facilities.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium">Facilities:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {node.facilities.map((facility, index) => (
                                  <span
                                    key={index}
                                    className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                                    style={{
                                      backgroundColor:
                                        getTransportModeColor("jaklingko") +
                                        "20",
                                      color: getTransportModeColor("jaklingko"),
                                    }}
                                  >
                                    {facility}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                {/* Draw JakLingko routes */}
                {jaklingkoGraph.edges
                  .filter((edge) => edge.routeNumber === route)
                  .map((edge, index) => {
                    const sourceNode = getNodeById(edge.source);
                    const targetNode = getNodeById(edge.target);

                    if (!sourceNode || !targetNode) return null;

                    const coords: [number, number][] = [
                      [sourceNode.latitude, sourceNode.longitude],
                      [targetNode.latitude, targetNode.longitude],
                    ];

                    return (
                      <Polyline
                        key={`jaklingko-${route}-edge-${index}`}
                        positions={coords}
                        color={edge.color || getTransportModeColor("jaklingko")}
                        weight={3}
                        opacity={0.6}
                        className="jaklingko-route"
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="text-xs font-medium">
                              JakLingko {route}
                            </h3>
                            <p className="text-[10px] mt-1">
                              From: {sourceNode.name}
                            </p>
                            <p className="text-[10px]">To: {targetNode.name}</p>
                            <p className="text-[10px] mt-1">
                              Distance: {edge.distance.toFixed(2)} km
                            </p>
                            <p className="text-[10px]">
                              Travel time: {edge.weight} min
                            </p>
                            {edge.fare && (
                              <p className="text-[10px]">
                                Fare: Rp {edge.fare.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </Popup>
                      </Polyline>
                    );
                  })}
              </LayerGroup>
            </LayersControl.Overlay>
          ))}

          {/* MRT Routes */}
          <LayersControl.Overlay name="MRT Jakarta" checked={false}>
            <LayerGroup>
              {mrtGraph.nodes.map((node) => (
                <Marker
                  key={`overlay-mrt-${node.id}`}
                  position={[node.latitude, node.longitude]}
                  icon={getStationIcon(node)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{node.name}</h3>
                      <div
                        className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                        style={{
                          backgroundColor: getTransportModeColor("mrt") + "20",
                          color: getTransportModeColor("mrt"),
                        }}
                      >
                        MRT {node.routeNumbers?.[0] || ""}
                      </div>
                      {node.stationType && (
                        <p className="text-xs mt-1 capitalize">
                          Type: {node.stationType}
                        </p>
                      )}
                      {node.address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {node.address}
                        </p>
                      )}
                      {node.facilities && node.facilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Facilities:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {node.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                                style={{
                                  backgroundColor:
                                    getTransportModeColor("mrt") + "20",
                                  color: getTransportModeColor("mrt"),
                                }}
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw MRT routes */}
              {mrtGraph.edges.map((edge, index) => {
                const sourceNode = getNodeById(edge.source);
                const targetNode = getNodeById(edge.target);

                if (!sourceNode || !targetNode) return null;

                const coords: [number, number][] = [
                  [sourceNode.latitude, sourceNode.longitude],
                  [targetNode.latitude, targetNode.longitude],
                ];

                return (
                  <Polyline
                    key={`mrt-edge-${index}`}
                    positions={coords}
                    color={edge.color || getTransportModeColor("mrt")}
                    weight={4}
                    opacity={0.7}
                    className="mrt-route"
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="text-xs font-medium">
                          MRT {edge.routeNumber || ""}
                        </h3>
                        <p className="text-[10px] mt-1">
                          From: {sourceNode.name}
                        </p>
                        <p className="text-[10px]">To: {targetNode.name}</p>
                        <p className="text-[10px] mt-1">
                          Distance: {edge.distance.toFixed(2)} km
                        </p>
                        <p className="text-[10px]">
                          Travel time: {edge.weight} min
                        </p>
                        {edge.fare && (
                          <p className="text-[10px]">
                            Fare: Rp {edge.fare.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* KRL Routes */}
          <LayersControl.Overlay name="KRL Commuter Line" checked={false}>
            <LayerGroup>
              {krlGraph.nodes.map((node) => (
                <Marker
                  key={`overlay-krl-${node.id}`}
                  position={[node.latitude, node.longitude]}
                  icon={getStationIcon(node)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{node.name}</h3>
                      <div
                        className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                        style={{
                          backgroundColor: getTransportModeColor("krl") + "20",
                          color: getTransportModeColor("krl"),
                        }}
                      >
                        KRL {node.routeNumbers?.join(", ") || ""}
                      </div>
                      {node.stationType && (
                        <p className="text-xs mt-1 capitalize">
                          Type: {node.stationType}
                        </p>
                      )}
                      {node.address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {node.address}
                        </p>
                      )}
                      {node.facilities && node.facilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Facilities:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {node.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                                style={{
                                  backgroundColor:
                                    getTransportModeColor("krl") + "20",
                                  color: getTransportModeColor("krl"),
                                }}
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw KRL routes */}
              {krlGraph.edges.map((edge, index) => {
                const sourceNode = getNodeById(edge.source);
                const targetNode = getNodeById(edge.target);

                if (!sourceNode || !targetNode) return null;

                const coords: [number, number][] = [
                  [sourceNode.latitude, sourceNode.longitude],
                  [targetNode.latitude, targetNode.longitude],
                ];

                return (
                  <Polyline
                    key={`krl-edge-${index}`}
                    positions={coords}
                    color={edge.color || getTransportModeColor("krl")}
                    weight={4}
                    opacity={0.7}
                    className="krl-route"
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="text-xs font-medium">
                          KRL {edge.routeNumber || ""}
                        </h3>
                        <p className="text-[10px] mt-1">
                          From: {sourceNode.name}
                        </p>
                        <p className="text-[10px]">To: {targetNode.name}</p>
                        <p className="text-[10px] mt-1">
                          Distance: {edge.distance.toFixed(2)} km
                        </p>
                        <p className="text-[10px]">
                          Travel time: {edge.weight} min
                        </p>
                        {edge.fare && (
                          <p className="text-[10px]">
                            Fare: Rp {edge.fare.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* LRT Routes */}
          <LayersControl.Overlay name="LRT Jakarta" checked={false}>
            <LayerGroup>
              {lrtGraph.nodes.map((node) => (
                <Marker
                  key={`overlay-lrt-${node.id}`}
                  position={[node.latitude, node.longitude]}
                  icon={getStationIcon(node)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{node.name}</h3>
                      <div
                        className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                        style={{
                          backgroundColor: getTransportModeColor("lrt") + "20",
                          color: getTransportModeColor("lrt"),
                        }}
                      >
                        LRT {node.routeNumbers?.[0] || ""}
                      </div>
                      {node.stationType && (
                        <p className="text-xs mt-1 capitalize">
                          Type: {node.stationType}
                        </p>
                      )}
                      {node.address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {node.address}
                        </p>
                      )}
                      {node.facilities && node.facilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Facilities:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {node.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                                style={{
                                  backgroundColor:
                                    getTransportModeColor("lrt") + "20",
                                  color: getTransportModeColor("lrt"),
                                }}
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw LRT routes */}
              {lrtGraph.edges.map((edge, index) => {
                const sourceNode = getNodeById(edge.source);
                const targetNode = getNodeById(edge.target);

                if (!sourceNode || !targetNode) return null;

                const coords: [number, number][] = [
                  [sourceNode.latitude, sourceNode.longitude],
                  [targetNode.latitude, targetNode.longitude],
                ];

                return (
                  <Polyline
                    key={`lrt-edge-${index}`}
                    positions={coords}
                    color={edge.color || getTransportModeColor("lrt")}
                    weight={4}
                    opacity={0.7}
                    className="lrt-route"
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="text-xs font-medium">
                          LRT {edge.routeNumber || ""}
                        </h3>
                        <p className="text-[10px] mt-1">
                          From: {sourceNode.name}
                        </p>
                        <p className="text-[10px]">To: {targetNode.name}</p>
                        <p className="text-[10px] mt-1">
                          Distance: {edge.distance.toFixed(2)} km
                        </p>
                        <p className="text-[10px]">
                          Travel time: {edge.weight} min
                        </p>
                        {edge.fare && (
                          <p className="text-[10px]">
                            Fare: Rp {edge.fare.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Render all stations */}
        {transjakartaGraph.nodes.map((node) => {
          // Hide unrelated stations when a path is selected
          if (
            !selectedPath.includes(node.id) &&
            node.id !== startNodeId &&
            node.id !== endNodeId &&
            (startNodeId || endNodeId)
          ) {
            return null;
          }

          // Get the appropriate icon for this station
          const icon = getStationIcon(node);

          return (
            <Marker
              key={node.id}
              position={[node.latitude, node.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{node.name}</h3>
                  {node.corridor && (
                    <div
                      className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-1"
                      style={{
                        backgroundColor: getCorridorColor(node.corridor) + "20",
                        color: getCorridorColor(node.corridor),
                      }}
                    >
                      Corridor {node.corridor}
                    </div>
                  )}
                  {node.stationType && (
                    <p className="text-xs mt-1 capitalize">
                      Type: {node.stationType}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Station ID: {node.id}
                  </p>
                  {node.address && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {node.address}
                    </p>
                  )}
                  {node.facilities && node.facilities.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Facilities:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {node.facilities.map((facility, index) => {
                          // Use the corridor color for facility tags if available
                          const color = node.corridor
                            ? getCorridorColor(node.corridor)
                            : "#6366f1";
                          return (
                            <span
                              key={index}
                              className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                              style={{
                                backgroundColor: color + "20",
                                color: color,
                              }}
                            >
                              {facility}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedPath.includes(node.id) && (
                    <p className="text-xs mt-2 text-primary font-medium">
                      Part of selected route
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw the selected path or comparison paths */}
        {comparisonMode ? (
          // Draw both paths in comparison mode with different styles
          <>
            {/* Use enhanced route segments for comparison mode if available */}
            {routeSegments && routeSegments.length > 0 ? (
              // Render enhanced segments for Dijkstra path (comparison mode uses Dijkstra path)
              <>
                {routeSegments.map((segment, index) => (
                  <Polyline
                    key={`comparison-enhanced-segment-${index}`}
                    positions={segment.coordinates}
                    color="#ef4444" // Red for Dijkstra in comparison
                    weight={routingMode === "osrm-realistic" ? 6 : 5}
                    opacity={0.9}
                    dashArray="10,5"
                    className="enhanced-route-comparison"
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="text-xs font-medium text-red-600">
                          Dijkstra: {segment.routeInfo.name}
                        </h3>
                        <p className="text-[10px] mt-1">
                          Mode: {routingMode === "osrm-realistic" ? "Realistic Roads" : "Straight Line"}
                        </p>
                        <p className="text-[10px]">
                          Duration: {segment.duration.toFixed(1)} minutes
                        </p>
                        <p className="text-[10px]">
                          Distance: {segment.distance.toFixed(2)} km
                        </p>
                      </div>
                    </Popup>
                  </Polyline>
                ))}
                {/* BFS path as simple line */}
                {bfsCoordinates.length > 1 && (
                  <Polyline
                    positions={bfsCoordinates}
                    color="#3b82f6" // Blue for BFS
                    weight={5}
                    opacity={0.8}
                    dashArray="5,5"
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="text-xs font-medium text-blue-600">
                          BFS Path (Straight Line)
                        </h3>
                        <p className="text-[10px] mt-1">
                          Fewest stations route
                        </p>
                      </div>
                    </Popup>
                  </Polyline>
                )}
              </>
            ) : (
              // Fallback to simple lines for comparison
              <>
                {dijkstraCoordinates.length > 1 && (
                  <Polyline
                    positions={dijkstraCoordinates}
                    color="#ef4444" // Red for Dijkstra
                    weight={5}
                    opacity={0.8}
                    dashArray="10,10"
                  />
                )}
                {bfsCoordinates.length > 1 && (
                  <Polyline
                    positions={bfsCoordinates}
                    color="#3b82f6" // Blue for BFS
                    weight={5}
                    opacity={0.8}
                    dashArray="5,5"
                  />
                )}
              </>
            )}
          </>
        ) : (
          // Draw single algorithm path with enhanced or corridor-specific styling
          <>
            {pathCoordinates.length > 1 && (
              <>
                {/* Use enhanced route segments if available, otherwise fallback to corridor-specific */}
                {routeSegments && routeSegments.length > 0 ? (
                  renderEnhancedRouteSegments()
                ) : (
                  selectedPath.length > 1 && renderCorridorSpecificRoutes(selectedPath)
                )}

                {/* Draw the overall path with a subtle outline for clarity (only for straight-line mode) */}
                {routingMode === "straight-line" && !routeSegments?.length && (
                  <Polyline
                    positions={pathCoordinates}
                    color="#000000"
                    weight={7}
                    opacity={0.2}
                    dashArray="10,10"
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Update view when path changes */}
        <SetViewOnPath
          path={selectedPath}
          startNodeId={startNodeId}
          endNodeId={endNodeId}
          comparisonMode={comparisonMode}
          dijkstraPath={dijkstraPath}
          bfsPath={bfsPath}
        />
      </MapContainer>
    </div>
  );
}
