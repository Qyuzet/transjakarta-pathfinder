"use client";
// @ts-nocheck

import { useState, useEffect } from "react";
import {
  combinedTransportGraph,
  transjakartaGraph,
  jaklingkoGraph,
  mrtGraph,
  krlGraph,
  lrtGraph,
  getTransportModeColor,
} from "@/lib/data/combined-transport";
import { Node, RoutingMode } from "@/lib/utils";
import { enhancedRoutingService } from "@/lib/enhanced-routing";
import {
  dijkstra,
  DijkstraResult,
  getAlgorithmMetrics as getDijkstraMetrics,
} from "@/lib/dijkstra";
import { enhancedDijkstra } from "@/lib/enhanced-dijkstra";
import {
  bfs,
  BFSResult,
  getAlgorithmMetrics as getBFSMetrics,
} from "@/lib/bfs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, Navigation, Clock, BarChart, Route, MapPin } from "lucide-react";
import { AnimatedAlgorithmSteps } from "@/components/algorithm/visualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlgorithmMetrics } from "@/components/algorithm/metrics";
import { AlgorithmComparison } from "@/components/algorithm/comparison";

import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const InteractiveMap = dynamic(
  () =>
    import("@/components/map/interactive-map").then(
      (mod) => mod.InteractiveMap
    ),
  { ssr: false }
);

// Define a union type for algorithm results
type AlgorithmResult = DijkstraResult | BFSResult;

// Define a type for comparison results
type ComparisonResult = {
  dijkstra: DijkstraResult;
  bfs: BFSResult;
  timeDifference: number;
  pathLengthDifference: number;
  nodesExploredDifference: number;
  isPathIdentical: boolean;
  executionTimeDifferenceMs: number;
  operationsDifference: number;
  edgesProcessedDifference: number;
  memoryUsageDifference: number;
  efficiencyRatio: number;
  speedRatio: number;
};

export function RouteFinder() {
  const [mounted, setMounted] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [endNodeId, setEndNodeId] = useState<string>("");
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState("map");
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "dijkstra" | "bfs" | "compare"
  >("dijkstra");
  const [selectedTransportModes, setSelectedTransportModes] = useState<
    string[]
  >(["transjakarta"]);
  const [routingMode, setRoutingMode] = useState<RoutingMode>("straight-line");
  const [routeSegments, setRouteSegments] = useState<any[]>([]);
  const [routeMetrics, setRouteMetrics] = useState<any>(null);

  // Only render after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get all stations from the combined graph
  const stations = combinedTransportGraph.nodes;

  // Helper function to get a node by ID from the combined graph
  const getNodeById = (nodeId: string): Node | undefined => {
    return combinedTransportGraph.nodes.find((node) => node.id === nodeId);
  };

  // Helper function to get OSRM-based route details
  const getOSRMRouteDetails = (algorithmResult: any) => {
    if (!algorithmResult.osrmRouteData || !algorithmResult.path) return null;

    const osrmData = algorithmResult.osrmRouteData;
    const path = algorithmResult.path;

    // Calculate total OSRM metrics
    let totalDuration = 0;
    let totalDistance = 0;
    let allInstructions: string[] = [];
    let totalRoadPoints = 0;

    // Aggregate data from all OSRM route segments
    for (const [key, routeData] of osrmData.entries()) {
      totalDuration += routeData.duration / 60; // Convert to minutes
      totalDistance += routeData.distance / 1000; // Convert to km
      totalRoadPoints += routeData.geometry?.length || 0;

      // Extract instructions
      if (routeData.steps) {
        const instructions = routeData.steps.map((step: any) =>
          step.maneuver?.instruction ||
          step.instruction ||
          step.name ||
          `${step.maneuver?.type || 'continue'} ${step.maneuver?.modifier ? 'and ' + step.maneuver.modifier : ''}`.trim()
        ).filter(Boolean);
        allInstructions.push(...instructions);
      }
    }

    return {
      totalStations: path.length,
      stationNames: path.map((id: string) => getNodeById(id)?.name || id),
      totalTimeMinutes: totalDuration,
      startStation: getNodeById(path[0]),
      endStation: getNodeById(path[path.length - 1]),
      isComparison: false,
      // OSRM-specific data
      osrmData: {
        totalDuration,
        totalDistance,
        totalRoadPoints,
        allInstructions,
        segmentCount: osrmData.size,
        algorithmDistance: algorithmResult.distance
      }
    };
  };

  const handleFindRoute = async () => {
    if (!startNodeId || !endNodeId) return;

    console.clear();
    console.log("🚀 STARTING ROUTE CALCULATION");
    console.log("Start Node ID:", startNodeId);
    console.log("End Node ID:", endNodeId);
    console.log("Algorithm:", selectedAlgorithm);
    console.log("Routing Mode:", routingMode);

    setIsCalculating(true);
    setComparisonResult(null);
    setRouteSegments([]);
    setRouteMetrics(null);

    // Small timeout to allow UI to update and show loading state
    setTimeout(async () => {
      if (selectedAlgorithm === "compare") {
        // Run both algorithms and compare results
        let dijkstraResult;
        if (routingMode === "osrm-realistic") {
          console.log("🔄 Using Enhanced Dijkstra with OSRM weights for comparison");
          dijkstraResult = await enhancedDijkstra(combinedTransportGraph, startNodeId, endNodeId, true);
        } else {
          console.log("🔄 Using Standard Dijkstra with straight-line weights for comparison");
          dijkstraResult = dijkstra(combinedTransportGraph, startNodeId, endNodeId);
        }
        const bfsResult = bfs(combinedTransportGraph, startNodeId, endNodeId);

        // Calculate comparison metrics
        const timeDifference = dijkstraResult.distance - bfsResult.distance;
        const pathLengthDifference =
          dijkstraResult.path.length - bfsResult.path.length;
        const nodesExploredDifference =
          dijkstraResult.nodesExplored - bfsResult.nodesExplored;
        const executionTimeDifferenceMs =
          dijkstraResult.executionTimeMs - bfsResult.executionTimeMs;
        const operationsDifference =
          dijkstraResult.priorityQueueOperations - bfsResult.queueOperations;
        const edgesProcessedDifference =
          dijkstraResult.edgesProcessed - bfsResult.edgesProcessed;
        const memoryUsageDifference =
          dijkstraResult.memoryUsageEstimate - bfsResult.memoryUsageEstimate;

        // Calculate efficiency and speed ratios
        const dijkstraEfficiency =
          dijkstraResult.path.length / (dijkstraResult.nodesExplored || 1);
        const bfsEfficiency =
          bfsResult.path.length / (bfsResult.nodesExplored || 1);
        const efficiencyRatio = dijkstraEfficiency / (bfsEfficiency || 1);

        const dijkstraSpeed =
          dijkstraResult.priorityQueueOperations /
          (dijkstraResult.executionTimeMs || 1);
        const bfsSpeed =
          bfsResult.queueOperations / (bfsResult.executionTimeMs || 1);
        const speedRatio = dijkstraSpeed / (bfsSpeed || 1);

        // Check if paths are identical
        const isPathIdentical =
          dijkstraResult.path.length === bfsResult.path.length &&
          dijkstraResult.path.every(
            (nodeId, index) => nodeId === bfsResult.path[index]
          );

        // Create comparison result
        const comparison: ComparisonResult = {
          dijkstra: dijkstraResult,
          bfs: bfsResult,
          timeDifference,
          pathLengthDifference,
          nodesExploredDifference,
          isPathIdentical,
          executionTimeDifferenceMs,
          operationsDifference,
          edgesProcessedDifference,
          memoryUsageDifference,
          efficiencyRatio,
          speedRatio,
        };

        setComparisonResult(comparison);
        setResult(null); // Clear single algorithm result

        // Get enhanced routing for comparison mode (use Dijkstra path)
        try {
          console.log("Getting enhanced routing for comparison mode, mode:", routingMode);
          console.log("Dijkstra path:", comparison.dijkstra.path);

          const segments = await enhancedRoutingService.getRouteSegments(
            comparison.dijkstra.path,
            combinedTransportGraph
          );
          const metrics = await enhancedRoutingService.getRouteMetrics(
            comparison.dijkstra.path,
            combinedTransportGraph
          );

          console.log("Enhanced routing segments (comparison):", segments);
          console.log("Enhanced routing metrics (comparison):", metrics);

          setRouteSegments(segments);
          setRouteMetrics(metrics);
        } catch (error) {
          console.error("Error getting enhanced routing:", error);
        }
      } else {
        // Run single algorithm
        let result;
        if (selectedAlgorithm === "dijkstra") {
          // Use enhanced dijkstra if OSRM mode is enabled
          if (routingMode === "osrm-realistic") {
            console.log("🔄 Using Enhanced Dijkstra with OSRM weights");
            result = await enhancedDijkstra(combinedTransportGraph, startNodeId, endNodeId, true);
          } else {
            console.log("🔄 Using Standard Dijkstra with straight-line weights");
            result = dijkstra(combinedTransportGraph, startNodeId, endNodeId);
          }
        } else {
          result = bfs(combinedTransportGraph, startNodeId, endNodeId);
        }
        setResult(result);
        setComparisonResult(null); // Clear comparison result

        // Get enhanced routing for single algorithm
        try {
          console.log("Getting enhanced routing for single algorithm, mode:", routingMode);
          console.log("Path:", result.path);

          const segments = await enhancedRoutingService.getRouteSegments(
            result.path,
            combinedTransportGraph
          );
          const metrics = await enhancedRoutingService.getRouteMetrics(
            result.path,
            combinedTransportGraph
          );

          console.log("Enhanced routing segments:", segments);
          console.log("Enhanced routing metrics:", metrics);

          setRouteSegments(segments);
          setRouteMetrics(metrics);
        } catch (error) {
          console.error("Error getting enhanced routing:", error);
        }
      }
      setIsCalculating(false);
    }, 500);
  };

  // Use getNodeById instead of getStationById

  const getRouteDetails = () => {
    if (result && result.path.length) {
      // Use OSRM data if available and in OSRM mode
      if (routingMode === "osrm-realistic" && (result as any).osrmRouteData) {
        return getOSRMRouteDetails(result);
      }

      // Fallback to standard route details
      const totalStations = result.path.length;
      const stationNames = result.path.map((id) => getNodeById(id)?.name || id);
      const totalTimeMinutes = result.distance;
      const startStation = getNodeById(result.path[0]);
      const endStation = getNodeById(result.path[result.path.length - 1]);

      return {
        totalStations,
        stationNames,
        totalTimeMinutes,
        startStation,
        endStation,
        isComparison: false,
      };
    } else if (comparisonResult) {
      // For comparison, we'll return details for both algorithms
      const dijkstraPath = comparisonResult.dijkstra.path;
      const bfsPath = comparisonResult.bfs.path;

      return {
        dijkstra: {
          totalStations: dijkstraPath.length,
          stationNames: dijkstraPath.map((id) => getNodeById(id)?.name || id),
          totalTimeMinutes: comparisonResult.dijkstra.distance,
          startStation: getNodeById(dijkstraPath[0]),
          endStation: getNodeById(dijkstraPath[dijkstraPath.length - 1]),
        },
        bfs: {
          totalStations: bfsPath.length,
          stationNames: bfsPath.map((id) => getNodeById(id)?.name || id),
          totalTimeMinutes: comparisonResult.bfs.distance,
          startStation: getNodeById(bfsPath[0]),
          endStation: getNodeById(bfsPath[bfsPath.length - 1]),
        },
        timeDifference: comparisonResult.timeDifference,
        pathLengthDifference: comparisonResult.pathLengthDifference,
        nodesExploredDifference: comparisonResult.nodesExploredDifference,
        isPathIdentical: comparisonResult.isPathIdentical,
        isComparison: true,
      };
    }

    return null;
  };

  const routeDetails = getRouteDetails();

  // Get the appropriate metrics based on the algorithm type
  const getMetrics = (result: AlgorithmResult) => {
    if (selectedAlgorithm === "dijkstra") {
      return getDijkstraMetrics(result as DijkstraResult);
    } else {
      return getBFSMetrics(result as BFSResult);
    }
  };

  // For comparison mode, we need metrics for both algorithms
  const getComparisonMetrics = () => {
    if (!comparisonResult) return null;

    return {
      dijkstra: getDijkstraMetrics(comparisonResult.dijkstra),
      bfs: getBFSMetrics(comparisonResult.bfs),
    };
  };

  const metrics = result ? getMetrics(result) : null;
  const comparisonMetrics = comparisonResult ? getComparisonMetrics() : null;

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Simple title */}
      <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
        Jabodetabek Public Transport Pathfinder
      </h1>
      <p className="text-sm text-muted-foreground mb-4 text-center lg:text-left">
        Find the best route using TransJakarta, JakLingko, MRT, KRL, and LRT
      </p>

      {/* Main layout with integrated controls */}
      <div className="flex flex-col gap-4 h-[calc(100vh-150px)]">
        {/* Controls in a horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-muted/20 p-3 rounded-md relative">
          <div className="space-y-1">
            <label className="text-sm font-medium">Start Station</label>
            <div className="relative">
              <Select value={startNodeId} onValueChange={setStartNodeId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select start" />
                </SelectTrigger>
                <SelectContent
                  className="z-[1000]"
                  align="start"
                  sideOffset={5}
                >
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">End Station</label>
            <div className="relative">
              <Select value={endNodeId} onValueChange={setEndNodeId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent
                  className="z-[1000]"
                  align="start"
                  sideOffset={5}
                >
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Algorithm</label>
            <div className="relative">
              <Select
                value={selectedAlgorithm}
                onValueChange={setSelectedAlgorithm as any}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent
                  className="z-[1000]"
                  position="popper"
                  sideOffset={5}
                  avoidCollisions={false}
                  side="bottom"
                >
                  <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                  <SelectItem value="bfs">
                    Breadth-First Search (BFS)
                  </SelectItem>
                  <SelectItem value="compare">
                    Compare Both Algorithms
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Routing Mode</label>
            <div className="relative">
              <Select
                value={routingMode}
                onValueChange={(value: RoutingMode) => {
                  setRoutingMode(value);
                  enhancedRoutingService.setRoutingMode(value);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select routing mode" />
                </SelectTrigger>
                <SelectContent
                  className="z-[1000]"
                  position="popper"
                  sideOffset={5}
                  avoidCollisions={false}
                  side="bottom"
                >
                  <SelectItem value="straight-line">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Straight Line (Current)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="osrm-realistic">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      <span>Realistic Roads (OSRM)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleFindRoute}
              disabled={
                !startNodeId ||
                !endNodeId ||
                startNodeId === endNodeId ||
                isCalculating
              }
              className="w-full h-9"
              size="sm"
            >
              {isCalculating ? "Calculating..." : "Find Route"}
              {!isCalculating && <SearchIcon className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Main content area with tabs and results */}
        <div className="flex flex-col lg:flex-row gap-4 flex-grow">
          {/* Route Results - Only shown when there's a result */}
          {routeDetails && (
            <div className="lg:w-1/4">
              <Card className="shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Route Details</CardTitle>
                  <CardDescription className="text-xs">
                    {routeDetails.isComparison
                      ? "Comparing both algorithms"
                      : selectedAlgorithm === "dijkstra"
                      ? "Fastest route by travel time"
                      : "Route with fewest stations"}
                    <div className="flex items-center gap-1 mt-1">
                      {routingMode === "osrm-realistic" ? (
                        <>
                          <Route className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Realistic Roads</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3 w-3 text-blue-600" />
                          <span className="text-blue-600">Straight Line</span>
                        </>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {routeDetails.isComparison ? (
                    // Comparison mode route details
                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <Navigation className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium">From - To</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {routeDetails.dijkstra.startStation?.name} →{" "}
                          {routeDetails.dijkstra.endStation?.name}
                        </p>
                      </div>

                      {/* Dijkstra details */}
                      <div className="p-2 bg-red-500/10 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <p className="text-xs font-medium">
                            Dijkstra's Algorithm
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <div>
                            <p className="text-[10px] text-muted-foreground">
                              Travel Time:
                            </p>
                            <p className="text-xs font-medium">
                              {routeDetails.dijkstra.totalTimeMinutes} min
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">
                              Stations:
                            </p>
                            <p className="text-xs font-medium">
                              {routeDetails.dijkstra.totalStations}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* BFS details */}
                      <div className="p-2 bg-blue-500/10 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <p className="text-xs font-medium">
                            Breadth-First Search
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <div>
                            <p className="text-[10px] text-muted-foreground">
                              Travel Time:
                            </p>
                            <p className="text-xs font-medium">
                              {routeDetails.bfs.totalTimeMinutes} min
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">
                              Stations:
                            </p>
                            <p className="text-xs font-medium">
                              {routeDetails.bfs.totalStations}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Comparison summary */}
                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <BarChart className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium">
                            Comparison Summary
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] flex justify-between">
                            <span>Time Difference:</span>
                            <span
                              className={
                                routeDetails.timeDifference > 0
                                  ? "text-red-500"
                                  : routeDetails.timeDifference < 0
                                  ? "text-blue-500"
                                  : ""
                              }
                            >
                              {Math.abs(routeDetails.timeDifference)} min{" "}
                              {routeDetails.timeDifference > 0
                                ? "(Dijkstra +)"
                                : routeDetails.timeDifference < 0
                                ? "(BFS +)"
                                : ""}
                            </span>
                          </p>
                          <p className="text-[10px] flex justify-between">
                            <span>Path Difference:</span>
                            <span
                              className={
                                routeDetails.pathLengthDifference > 0
                                  ? "text-red-500"
                                  : routeDetails.pathLengthDifference < 0
                                  ? "text-blue-500"
                                  : ""
                              }
                            >
                              {Math.abs(routeDetails.pathLengthDifference)}{" "}
                              stations{" "}
                              {routeDetails.pathLengthDifference > 0
                                ? "(Dijkstra +)"
                                : routeDetails.pathLengthDifference < 0
                                ? "(BFS +)"
                                : ""}
                            </span>
                          </p>
                          <p className="text-[10px] flex justify-between">
                            <span>Same Path:</span>
                            <span>
                              {routeDetails.isPathIdentical ? "Yes" : "No"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single algorithm route details
                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <Navigation className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium">From - To</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {routeDetails.startStation?.name} →{" "}
                          {routeDetails.endStation?.name}
                        </p>
                      </div>

                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium">Travel Time</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {routeDetails.totalTimeMinutes.toFixed(1)} minutes
                          {routeDetails.osrmData && (
                            <span className="ml-1 text-green-600">(OSRM)</span>
                          )}
                        </p>
                      </div>

                      {/* OSRM-specific details */}
                      {routeDetails.osrmData && (
                        <>
                          <div className="p-2 bg-green-50 rounded-md">
                            <div className="flex items-center gap-1 mb-1">
                              <Route className="h-4 w-4 text-green-600" />
                              <p className="text-xs font-medium text-green-600">OSRM Route Data</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Distance:</p>
                                <p className="font-medium">{routeDetails.osrmData.totalDistance.toFixed(2)} km</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Road Points:</p>
                                <p className="font-medium text-green-600">{routeDetails.osrmData.totalRoadPoints}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Instructions:</p>
                                <p className="font-medium">{routeDetails.osrmData.allInstructions.length}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Segments:</p>
                                <p className="font-medium">{routeDetails.osrmData.segmentCount}</p>
                              </div>
                            </div>
                          </div>

                          {/* Turn-by-Turn Instructions in Route Details */}
                          {routeDetails.osrmData.allInstructions.length > 0 && (
                            <div className="p-2 bg-blue-50 rounded-md">
                              <div className="flex items-center gap-1 mb-1">
                                <Navigation className="h-4 w-4 text-blue-600" />
                                <p className="text-xs font-medium text-blue-600">Turn Instructions</p>
                              </div>
                              <div className="max-h-24 overflow-y-auto">
                                <ol className="list-decimal list-inside space-y-1">
                                  {routeDetails.osrmData.allInstructions.slice(0, 5).map((instruction: string, index: number) => (
                                    <li key={index} className="text-xs text-muted-foreground">
                                      {instruction}
                                    </li>
                                  ))}
                                  {routeDetails.osrmData.allInstructions.length > 5 && (
                                    <li className="text-xs text-muted-foreground italic">
                                      ... and {routeDetails.osrmData.allInstructions.length - 5} more instructions
                                    </li>
                                  )}
                                </ol>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <BarChart className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium">
                            Stations ({routeDetails.totalStations})
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {routeDetails.stationNames.map((name, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs py-0 h-5"
                            >
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map and Visualization */}
          <div
            className={
              result && routeDetails ? "lg:w-3/4 flex-grow" : "w-full flex-grow"
            }
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="visualization">
                  Algorithm Visualization
                </TabsTrigger>
              </TabsList>

              <div className="flex-grow overflow-hidden">
                <TabsContent value="map" className="h-full m-0 p-0">
                  <div className="h-full border rounded-md overflow-hidden">
                    <InteractiveMap
                      selectedPath={result?.path || []}
                      startNodeId={startNodeId}
                      endNodeId={endNodeId}
                      comparisonMode={!!comparisonResult}
                      dijkstraPath={comparisonResult?.dijkstra.path || []}
                      bfsPath={comparisonResult?.bfs.path || []}
                      routingMode={routingMode}
                      routeSegments={routeSegments}
                      routeMetrics={routeMetrics}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="visualization" className="h-full m-0 p-0">
                  <div className="h-full border rounded-md overflow-auto">
                    {comparisonResult ? (
                      // Show comparison visualization
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2">
                            Algorithm Comparison
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dijkstra visualization */}
                            <div className="border rounded-md p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                                Dijkstra's Algorithm
                              </h4>
                              <AnimatedAlgorithmSteps
                                steps={comparisonResult.dijkstra.steps}
                                path={comparisonResult.dijkstra.path}
                                graph={transjakartaGraph}
                                algorithmName="dijkstra"
                                osrmData={(comparisonResult.dijkstra as any).osrmRouteData}
                                routingMode={routingMode}
                              />
                            </div>

                            {/* BFS visualization */}
                            <div className="border rounded-md p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                                Breadth-First Search
                              </h4>
                              <AnimatedAlgorithmSteps
                                steps={comparisonResult.bfs.steps}
                                path={comparisonResult.bfs.path}
                                graph={transjakartaGraph}
                                algorithmName="bfs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* OSRM Routing Information for Comparison */}
                        {routingMode === "osrm-realistic" && routeSegments && routeSegments.length > 0 && (
                          <div className="mb-6 border-t pt-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                              <Route className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">OSRM Realistic Routing (Dijkstra Path)</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              {/* Route Metrics */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Route Metrics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {routeMetrics && (
                                    <>
                                      <div className="flex justify-between text-sm">
                                        <span>Duration:</span>
                                        <span className="font-medium">{routeMetrics.totalDuration.toFixed(1)} min</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Distance:</span>
                                        <span className="font-medium">{routeMetrics.totalDistance.toFixed(2)} km</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Segments:</span>
                                        <span className="font-medium">{routeMetrics.segmentCount}</span>
                                      </div>
                                    </>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Route Segments */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Route Segments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {routeSegments.slice(0, 3).map((segment, index) => (
                                      <div key={index} className="p-1 bg-muted/50 rounded text-xs">
                                        <div className="font-medium truncate">{segment.routeInfo.name}</div>
                                        <div className="text-muted-foreground">
                                          {segment.duration.toFixed(1)}min • {segment.distance.toFixed(1)}km
                                        </div>
                                      </div>
                                    ))}
                                    {routeSegments.length > 3 && (
                                      <div className="text-xs text-muted-foreground text-center">
                                        +{routeSegments.length - 3} more segments
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Instructions Summary */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Navigation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>Total Instructions:</span>
                                      <span className="font-medium">
                                        {routeSegments.reduce((total, segment) =>
                                          total + (segment.instructions?.length || 0), 0
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Road Points:</span>
                                      <span className="font-medium text-green-600">
                                        {routeSegments.reduce((total, segment) =>
                                          total + segment.coordinates.length, 0
                                        )}
                                      </span>
                                    </div>
                                    <div className="text-muted-foreground">
                                      Real road geometry vs straight lines
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}

                        {/* Algorithm Performance Comparison */}
                        <div className="mt-4">
                          <AlgorithmComparison
                            dijkstra={comparisonResult.dijkstra}
                            bfs={comparisonResult.bfs}
                            timeDifference={comparisonResult.timeDifference}
                            pathLengthDifference={
                              comparisonResult.pathLengthDifference
                            }
                            nodesExploredDifference={
                              comparisonResult.nodesExploredDifference
                            }
                            isPathIdentical={comparisonResult.isPathIdentical}
                            executionTimeDifferenceMs={
                              comparisonResult.executionTimeDifferenceMs
                            }
                            operationsDifference={
                              comparisonResult.operationsDifference
                            }
                            edgesProcessedDifference={
                              comparisonResult.edgesProcessedDifference
                            }
                            memoryUsageDifference={
                              comparisonResult.memoryUsageDifference
                            }
                            efficiencyRatio={comparisonResult.efficiencyRatio}
                            speedRatio={comparisonResult.speedRatio}
                          />
                        </div>
                      </div>
                    ) : result ? (
                      // Show single algorithm visualization
                      <div className="p-4 space-y-6">
                        {/* Algorithm Steps Visualization */}
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary"></span>
                            {selectedAlgorithm === "dijkstra" ? "Dijkstra's Algorithm" : "Breadth-First Search"} Steps
                          </h3>
                          <AnimatedAlgorithmSteps
                            steps={result.steps}
                            path={result.path}
                            graph={transjakartaGraph}
                            algorithmName={selectedAlgorithm}
                            osrmData={(result as any).osrmRouteData}
                            routingMode={routingMode}
                          />
                        </div>

                        {/* OSRM Routing Information */}
                        {routingMode === "osrm-realistic" && (routeSegments?.length > 0 || (result as any).osrmRouteData) && (
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                              <Route className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">OSRM Realistic Routing</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {/* Route Metrics */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Route Metrics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {routeMetrics && (
                                    <>
                                      <div className="flex justify-between text-sm">
                                        <span>Total Duration:</span>
                                        <span className="font-medium">{routeMetrics.totalDuration.toFixed(1)} min</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Total Distance:</span>
                                        <span className="font-medium">{routeMetrics.totalDistance.toFixed(2)} km</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Route Segments:</span>
                                        <span className="font-medium">{routeMetrics.segmentCount}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Routing Mode:</span>
                                        <span className="font-medium text-green-600">Realistic Roads</span>
                                      </div>
                                    </>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Route Segments */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Route Segments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {routeSegments.map((segment, index) => (
                                      <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                                        <div className="font-medium">{segment.routeInfo.name}</div>
                                        <div className="text-muted-foreground">
                                          {segment.duration.toFixed(1)}min • {segment.distance.toFixed(2)}km
                                          {segment.coordinates.length > 2 && (
                                            <span className="ml-2 text-green-600">
                                              • {segment.coordinates.length} road points
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Turn-by-Turn Instructions */}
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Turn-by-Turn Instructions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                  {(() => {
                                    console.log("🔍 Checking instructions for segments:", routeSegments.map(s => ({
                                      name: s.routeInfo.name,
                                      hasInstructions: !!s.instructions,
                                      instructionCount: s.instructions?.length || 0,
                                      instructions: s.instructions
                                    })));

                                    const segmentsWithInstructions = routeSegments.filter(s => s.instructions && s.instructions.length > 0);

                                    if (segmentsWithInstructions.length === 0) {
                                      return (
                                        <div className="text-center py-4">
                                          <div className="text-sm text-muted-foreground mb-2">
                                            No detailed turn instructions available
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            OSRM may not have provided step-by-step directions for this route
                                          </div>
                                          <div className="mt-3 p-3 bg-muted/50 rounded text-xs">
                                            <div className="font-medium mb-2">Route Summary:</div>
                                            {routeSegments.map((segment, index) => (
                                              <div key={index} className="mb-2 p-2 bg-background rounded border-l-2 border-green-500">
                                                <div className="font-medium text-green-600">
                                                  {index + 1}. {segment.routeInfo.name}
                                                </div>
                                                <div className="text-muted-foreground mt-1">
                                                  Duration: {segment.duration.toFixed(1)} minutes
                                                </div>
                                                <div className="text-muted-foreground">
                                                  Distance: {segment.distance.toFixed(2)} km
                                                </div>
                                                <div className="text-muted-foreground">
                                                  Road points: {segment.coordinates.length} GPS coordinates
                                                </div>
                                              </div>
                                            ))}
                                            <div className="mt-2 text-xs text-muted-foreground italic">
                                              💡 Tip: OSRM provided route geometry but no detailed turn instructions for this route.
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }

                                    return segmentsWithInstructions.map((segment, segmentIndex) => (
                                      <div key={segmentIndex} className="border-l-2 border-green-500 pl-3">
                                        <h4 className="text-sm font-medium text-green-600 mb-1">
                                          {segment.routeInfo.name}
                                        </h4>
                                        <ol className="list-decimal list-inside space-y-1">
                                          {segment.instructions.map((instruction, index) => (
                                            <li key={index} className="text-xs text-foreground">
                                              {instruction}
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Algorithm Performance Metrics */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Algorithm Performance</h3>

                          {/* Enhanced metrics with OSRM data */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Algorithm Metrics */}
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Algorithm Metrics</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Execution Time:</span>
                                  <span className="font-medium">{result.executionTimeMs.toFixed(2)} ms</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Nodes Explored:</span>
                                  <span className="font-medium">{result.nodesExplored}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Path Length:</span>
                                  <span className="font-medium">{result.path.length} stations</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Algorithm Distance:</span>
                                  <span className="font-medium">{result.distance.toFixed(1)} min</span>
                                </div>
                                {selectedAlgorithm === "dijkstra" && (
                                  <>
                                    <div className="flex justify-between text-sm">
                                      <span>Priority Queue Ops:</span>
                                      <span className="font-medium">{(result as any).priorityQueueOperations}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Edges Processed:</span>
                                      <span className="font-medium">{(result as any).edgesProcessed}</span>
                                    </div>
                                    {routingMode === "osrm-realistic" && (result as any).osrmCallsCount !== undefined && (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span>OSRM API Calls:</span>
                                          <span className="font-medium text-green-600">{(result as any).osrmCallsCount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>OSRM Cache Size:</span>
                                          <span className="font-medium text-green-600">{(result as any).osrmCacheSize}</span>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                                {selectedAlgorithm === "bfs" && (
                                  <div className="flex justify-between text-sm">
                                    <span>Queue Operations:</span>
                                    <span className="font-medium">{(result as any).queueOperations}</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* OSRM vs Algorithm Comparison */}
                            {routingMode === "osrm-realistic" && routeMetrics && (
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Routing Comparison</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="text-xs font-medium mb-2 text-green-600">
                                    {routingMode === "osrm-realistic" ? "OSRM Route vs Algorithm (using OSRM weights):" : "OSRM Route vs Algorithm:"}
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>OSRM Route Duration:</span>
                                    <span className="font-medium text-green-600">{routeMetrics.totalDuration.toFixed(1)} min</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Algorithm Result:</span>
                                    <span className="font-medium text-blue-600">{result.distance.toFixed(1)} min</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Difference:</span>
                                    <span className="font-medium">
                                      {Math.abs(routeMetrics.totalDuration - result.distance).toFixed(1)} min
                                    </span>
                                  </div>
                                  {routingMode === "osrm-realistic" && (
                                    <div className="text-xs text-green-600 mt-1 p-2 bg-green-50 rounded">
                                      ✅ Algorithm now uses OSRM weights - results should be very similar!
                                    </div>
                                  )}
                                  <div className="flex justify-between text-sm">
                                    <span>OSRM Distance:</span>
                                    <span className="font-medium text-green-600">{routeMetrics.totalDistance.toFixed(2)} km</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>OSRM Road Points:</span>
                                    <span className="font-medium text-green-600">
                                      {routeSegments.reduce((total, segment) => total + segment.coordinates.length, 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Algorithm Nodes:</span>
                                    <span className="font-medium text-blue-600">{result.nodesExplored}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Routing Type:</span>
                                    <span className="font-medium text-green-600">Real Roads</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                                    <strong>Note:</strong> OSRM road points are GPS coordinates along actual roads.
                                    Algorithm nodes are transit stations explored during pathfinding.
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>

                          {/* Original Algorithm Metrics Component */}
                          <div className="mt-4">
                            <AlgorithmMetrics result={result} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Show empty state
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <SearchIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Select stations and calculate a route to see the
                            algorithm visualization
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
