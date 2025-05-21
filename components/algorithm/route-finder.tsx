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
import { Node } from "@/lib/utils";
import {
  dijkstra,
  DijkstraResult,
  getAlgorithmMetrics as getDijkstraMetrics,
} from "@/lib/dijkstra";
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
import { SearchIcon, Navigation, Clock, BarChart } from "lucide-react";
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

  const handleFindRoute = () => {
    if (!startNodeId || !endNodeId) return;

    setIsCalculating(true);
    setComparisonResult(null);

    // Small timeout to allow UI to update and show loading state
    setTimeout(() => {
      if (selectedAlgorithm === "compare") {
        // Run both algorithms and compare results
        const dijkstraResult = dijkstra(
          combinedTransportGraph,
          startNodeId,
          endNodeId
        );
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
      } else {
        // Run single algorithm
        let result;
        if (selectedAlgorithm === "dijkstra") {
          result = dijkstra(combinedTransportGraph, startNodeId, endNodeId);
        } else {
          result = bfs(combinedTransportGraph, startNodeId, endNodeId);
        }
        setResult(result);
        setComparisonResult(null); // Clear comparison result
      }
      setIsCalculating(false);
    }, 500);
  };

  // Use getNodeById instead of getStationById

  const getRouteDetails = () => {
    if (result && result.path.length) {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-md relative">
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
                          {routeDetails.totalTimeMinutes} minutes
                        </p>
                      </div>

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

                        {/* Import and use the comparison component */}
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
                      <div className="p-4">
                        <AnimatedAlgorithmSteps
                          steps={result.steps}
                          path={result.path}
                          graph={transjakartaGraph}
                          algorithmName={selectedAlgorithm}
                        />
                        <AlgorithmMetrics result={result} />
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
