"use client";
// @ts-nocheck

import React, { useEffect, useState } from "react";
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
import { transjakartaGraph, getNodeById } from "@/lib/data/transjakarta-routes";
import { Button } from "@/components/ui/button";
import { Bus, Map, X } from "lucide-react";

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
};

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

  // Create custom icons based on station type
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

    // Otherwise, use icons based on station type
    const stationType = node.stationType || "regular";
    const corridorColor = node.corridor
      ? getCorridorColor(node.corridor)
      : "#6366f1";

    // Create a short name for the station (first letter of each word)
    const shortName = node.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Create corridor label
    const corridorLabel = node.corridor ? `C${node.corridor}` : "";

    // Create different icons based on station type
    if (stationType === "terminal") {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${corridorColor}; border: 2px solid white;">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal-square"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m7 15 3-3-3-3"/><path d="M17 15h-6"/></svg>
            ${corridorLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    } else if (stationType === "interchange") {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${corridorColor}; border: 2px solid white;">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-merge"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v12"/><path d="m18 15-6-6"/></svg>
            ${corridorLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    } else {
      return divIcon({
        className: "custom-div-icon",
        html: `<div class="bus-stop-marker" style="background-color: ${corridorColor};">
          <div class="marker-label">${shortName}</div>
          <div class="marker-details">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>
            ${corridorLabel}
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    }
  };

  // Helper function to get corridor color
  const getCorridorColor = (corridor: string): string => {
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
  };

  // Function to render corridor-specific route segments
  const renderCorridorSpecificRoutes = (path: string[]) => {
    if (path.length < 2) return null;

    // Group path segments by corridor
    const corridorSegments: Record<
      string,
      { start: string; end: string; coords: [number, number][] }[]
    > = {};

    // Process each segment in the path
    for (let i = 0; i < path.length - 1; i++) {
      const sourceId = path[i];
      const targetId = path[i + 1];

      // Find the edge between these nodes
      const edge = transjakartaGraph.edges.find(
        (e) => e.source === sourceId && e.target === targetId
      );

      if (!edge) continue;

      // Get the corridor (default to "unknown" if not specified)
      const corridor = edge.corridor || "unknown";

      // Get coordinates for this segment
      const sourceNode = getNodeById(sourceId);
      const targetNode = getNodeById(targetId);

      if (!sourceNode || !targetNode) continue;

      const coords: [number, number][] = [
        [sourceNode.latitude, sourceNode.longitude],
        [targetNode.latitude, targetNode.longitude],
      ];

      // Add to corridor segments
      if (!corridorSegments[corridor]) {
        corridorSegments[corridor] = [];
      }

      corridorSegments[corridor].push({
        start: sourceId,
        end: targetId,
        coords,
      });
    }

    // Render each corridor's segments with appropriate styling
    return (
      <>
        {Object.entries(corridorSegments).map(([corridor, segments]) => (
          <React.Fragment key={corridor}>
            {segments.map((segment, index) => (
              <Polyline
                key={`${corridor}-${segment.start}-${segment.end}-${index}`}
                positions={segment.coords}
                color={getCorridorColor(corridor)}
                weight={5}
                opacity={0.8}
                dashArray={corridor === "unknown" ? "5,5" : ""}
                className="corridor-route"
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="text-xs font-medium">
                      {corridor !== "unknown"
                        ? `Corridor ${corridor}`
                        : "Connection"}
                    </h3>
                    <p className="text-[10px] mt-1">
                      From: {getNodeById(segment.start)?.name || segment.start}
                    </p>
                    <p className="text-[10px]">
                      To: {getNodeById(segment.end)?.name || segment.end}
                    </p>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </React.Fragment>
        ))}
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
        <div className="absolute bottom-12 left-2 z-[1000] bg-white/90 dark:bg-gray-900/90 p-2 rounded-md shadow-md border max-w-[200px] text-xs">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">TransJakarta Legend</h4>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0"
              onClick={() => setShowLegend(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
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
            <div className="mt-1 pt-1 border-t">
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

          {/* Overlay layers for corridors */}
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
            (corridor) => (
              <LayersControl.Overlay
                key={corridor}
                name={`Corridor ${corridor}`}
                checked={!startNodeId && !endNodeId} // Only show by default if no path is selected
              >
                <LayerGroup>
                  {transjakartaGraph.nodes
                    .filter((node) => node.corridor === corridor)
                    .map((node) => (
                      <Marker
                        key={`overlay-${node.id}`}
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
        ) : (
          // Draw single algorithm path with corridor-specific styling
          <>
            {pathCoordinates.length > 1 && (
              <>
                {/* Draw route with corridor-specific colors */}
                {selectedPath.length > 1 &&
                  renderCorridorSpecificRoutes(selectedPath)}

                {/* Draw the overall path with a subtle outline for clarity */}
                <Polyline
                  positions={pathCoordinates}
                  color="#000000"
                  weight={7}
                  opacity={0.2}
                  dashArray="10,10"
                />
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
