"use client";
// @ts-nocheck

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import { transjakartaGraph, getNodeById } from "@/lib/data/transjakarta-routes";
import { Button } from "@/components/ui/button";
import { Bus } from "lucide-react";

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

  const busIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const startIcon = divIcon({
    className: "custom-div-icon",
    html: `<div class="bus-stop-marker" style="background-color: #10b981;">A</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const endIcon = divIcon({
    className: "custom-div-icon",
    html: `<div class="bus-stop-marker" style="background-color: #ef4444;">B</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const normalIcon = divIcon({
    className: "custom-div-icon",
    html: `<div class="bus-stop-marker" style="background-color: #6366f1;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <div className="h-full w-full overflow-hidden rounded-md border">
      <MapContainer
        center={JAKARTA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render all stations */}
        {transjakartaGraph.nodes.map((node) => {
          let icon = normalIcon;

          // Special icons for start and end nodes
          if (node.id === startNodeId) {
            icon = startIcon;
          } else if (node.id === endNodeId) {
            icon = endIcon;
          } else if (
            !selectedPath.includes(node.id) &&
            (startNodeId || endNodeId)
          ) {
            return null; // Hide unrelated stations when a path is selected
          }

          return (
            <Marker
              key={node.id}
              position={[node.latitude, node.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{node.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Station ID: {node.id}
                  </p>
                  {selectedPath.includes(node.id) && (
                    <p className="text-xs mt-1 text-primary">
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
          // Draw single algorithm path
          pathCoordinates.length > 1 && (
            <Polyline
              positions={pathCoordinates}
              color="#ef4444"
              weight={5}
              opacity={0.8}
              dashArray="10,10"
            />
          )
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
