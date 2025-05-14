"use client";
// @ts-nocheck

import { useState, useEffect } from "react";
import { DijkstraStep } from "@/lib/dijkstra";
import { BFSStep } from "@/lib/bfs";
import { Graph, Node } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  Network,
  List,
} from "lucide-react";
import { motion } from "framer-motion";
import { GraphVisualization } from "@/components/algorithm/graph-visualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a union type for algorithm steps
type AlgorithmStep = DijkstraStep | BFSStep;

type VisualizationProps = {
  steps: AlgorithmStep[];
  path: string[];
  graph: Graph;
  algorithmName?: "dijkstra" | "bfs";
};

export function AnimatedAlgorithmSteps({
  steps,
  path,
  graph,
  algorithmName = "dijkstra",
}: VisualizationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms between steps

  const currentStep = steps[currentStepIndex];

  // Create a simplified graph for visualization
  // We'll only show nodes that are part of the algorithm's exploration
  const relevantNodes = new Set<string>();
  steps.forEach((step) => {
    step.visitedNodes.forEach((nodeId) => relevantNodes.add(nodeId));
  });
  path.forEach((nodeId) => relevantNodes.add(nodeId));

  const visualizationNodes = graph.nodes.filter((node) =>
    relevantNodes.has(node.id)
  );

  // Create edges for visualization
  const visualizationEdges = graph.edges.filter(
    (edge) => relevantNodes.has(edge.source) && relevantNodes.has(edge.target)
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex >= steps.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, playbackSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const getNodeClass = (nodeId: string) => {
    if (currentStep) {
      if (path.includes(nodeId) && currentStepIndex === steps.length - 1) {
        return "node-path";
      }
      if (nodeId === currentStep.currentNode) {
        return "node-current";
      }
      if (currentStep.visitedNodes.includes(nodeId)) {
        return "node-visited";
      }
    }
    return "node-unvisited";
  };

  const getNodeDistance = (nodeId: string) => {
    if (!currentStep) return "Infinity";
    const distance = currentStep.distances[nodeId];
    return distance === Infinity ? "∞" : distance.toString();
  };

  // Given a simplified visualization of nodes and edges
  return (
    <div className="mb-4">
      {/* Compact header with controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {algorithmName === "dijkstra" ? "Dijkstra" : "BFS"}
          </div>
          <p className="text-xs text-muted-foreground">
            Step <span className="font-medium">{currentStepIndex + 1}</span>/
            {steps.length}
            {currentStep?.currentNode && (
              <span className="ml-1">
                • Node{" "}
                <span className="font-medium">{currentStep.currentNode}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex bg-muted/30 p-0.5 rounded-md">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleReset}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handlePlayToggle}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
            >
              <SkipForward className="h-3 w-3" />
            </Button>
          </div>

          <select
            className="h-7 text-xs bg-muted/30 border-0 rounded-md px-1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value="2000">Slow</option>
            <option value="1000">Normal</option>
            <option value="500">Fast</option>
          </select>
        </div>
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="graph" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-8 mb-2">
          <TabsTrigger
            value="graph"
            className="text-xs flex items-center gap-1"
          >
            <Network className="h-3 w-3" />
            Graph View
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs flex items-center gap-1">
            <List className="h-3 w-3" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Graph Visualization Tab */}
        <TabsContent value="graph" className="mt-0">
          {/* Node status legend */}
          <div className="flex flex-wrap gap-2 bg-muted/20 p-2 rounded-md text-xs mb-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--unvisited-node))]"></div>
              <span>Unvisited</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--visited-node))]"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--current-node))]"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--path-node))]"></div>
              <span>Path</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Frontier Edge</span>
            </div>
          </div>

          {/* Graph Visualization */}
          <GraphVisualization
            steps={steps}
            path={path}
            graph={graph}
            currentStepIndex={currentStepIndex}
            algorithmName={algorithmName}
          />

          {/* Tip */}
          <div className="mt-2 text-xs text-muted-foreground">
            <p>
              Tip: Hover over nodes and edges for details. Drag nodes to
              rearrange the graph.
            </p>
          </div>
        </TabsContent>

        {/* List Visualization Tab */}
        <TabsContent value="list" className="mt-0">
          {/* Node status legend and visualization container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* Legend in a more compact form */}
            <div className="flex md:flex-col flex-wrap gap-1 md:gap-2 bg-muted/20 p-2 rounded-md text-xs h-fit">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--unvisited-node))]"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--visited-node))]"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--current-node))]"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--path-node))]"></div>
                <span>Path</span>
              </div>
            </div>

            {/* Algorithm visualization with nodes and edges */}
            <div className="md:col-span-3 relative border rounded-md h-[350px] overflow-auto bg-muted/10 p-2">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {visualizationNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={cn("algorithm-node", getNodeClass(node.id))}
                    >
                      {node.id}
                    </div>
                    <div className="mt-1 text-xs">
                      <div className="font-semibold">{node.name}</div>
                      <div>Dist: {getNodeDistance(node.id)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Nodes with detailed information in a compact table */}
          <div className="mt-2 border rounded-md overflow-hidden">
            <div className="bg-muted/20 px-2 py-1 flex items-center justify-between">
              <h4 className="text-xs font-medium">Node Details</h4>
              <p className="text-xs text-muted-foreground">
                {visualizationNodes.length} nodes
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 max-h-[200px] overflow-auto">
              {visualizationNodes.map((node) => {
                const nodeClass = getNodeClass(node.id);
                const isVisited = currentStep?.visitedNodes.includes(node.id);
                const distance = currentStep?.distances[node.id];
                const previousNode = currentStep?.previousNodes[node.id];

                return (
                  <div
                    key={node.id}
                    className={cn(
                      "p-1.5 rounded-md border text-xs transition-colors",
                      nodeClass === "node-current" &&
                        "border-[hsl(var(--current-node))] bg-[hsl(var(--current-node))]/10",
                      nodeClass === "node-visited" &&
                        "border-[hsl(var(--visited-node))] bg-[hsl(var(--visited-node))]/10",
                      nodeClass === "node-path" &&
                        "border-[hsl(var(--path-node))] bg-[hsl(var(--path-node))]/10"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div
                        className={cn(
                          "w-4 h-4 flex items-center justify-center rounded-full text-[10px]",
                          getNodeClass(node.id)
                        )}
                      >
                        {node.id}
                      </div>
                      <div className="font-medium truncate">{node.name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <div>
                        S:{" "}
                        <span className="font-medium">
                          {isVisited ? "V" : "U"}
                        </span>
                      </div>
                      <div>
                        D:{" "}
                        <span className="font-medium">
                          {distance === Infinity ? "∞" : distance}
                        </span>
                      </div>
                      <div>
                        P:{" "}
                        <span className="font-medium">
                          {previousNode || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
