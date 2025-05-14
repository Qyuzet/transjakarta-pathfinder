"use client";

import { useState, useEffect } from "react";
import {
  transjakartaGraph,
  getNodeById,
  getAllStations,
} from "@/lib/data/transjakarta-routes";
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

export function RouteFinder() {
  const [mounted, setMounted] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [endNodeId, setEndNodeId] = useState<string>("");
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [activeTab, setActiveTab] = useState("map");
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "dijkstra" | "bfs"
  >("dijkstra");

  // Only render after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const stations = getAllStations();

  const handleFindRoute = () => {
    if (!startNodeId || !endNodeId) return;

    setIsCalculating(true);

    // Small timeout to allow UI to update and show loading state
    setTimeout(() => {
      let result;
      if (selectedAlgorithm === "dijkstra") {
        result = dijkstra(transjakartaGraph, startNodeId, endNodeId);
      } else {
        result = bfs(transjakartaGraph, startNodeId, endNodeId);
      }
      setResult(result);
      setIsCalculating(false);
    }, 500);
  };

  const getStationById = (id: string) => {
    return stations.find((station) => station.id === id);
  };

  const getRouteDetails = () => {
    if (!result || !result.path.length) return null;

    const totalStations = result.path.length;
    const stationNames = result.path.map(
      (id) => getStationById(id)?.name || id
    );
    const totalTimeMinutes = result.distance;
    const startStation = getStationById(result.path[0]);
    const endStation = getStationById(result.path[result.path.length - 1]);

    return {
      totalStations,
      stationNames,
      totalTimeMinutes,
      startStation,
      endStation,
    };
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

  const metrics = result ? getMetrics(result) : null;

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Simple title */}
      <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
        TransJakarta Route Finder
      </h1>

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
          {result && routeDetails && (
            <div className="lg:w-1/4">
              <Card className="shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Route Details</CardTitle>
                  <CardDescription className="text-xs">
                    {selectedAlgorithm === "dijkstra"
                      ? "Fastest route by travel time"
                      : "Route with fewest stations"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
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
                    />
                  </div>
                </TabsContent>

                <TabsContent value="visualization" className="h-full m-0 p-0">
                  <div className="h-full border rounded-md overflow-auto">
                    {result ? (
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
