"use client";

import { DijkstraResult } from "@/lib/dijkstra";
import { BFSResult } from "@/lib/bfs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  Cpu,
  Clock,
  Network,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts";

type ComparisonProps = {
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

export function AlgorithmComparison({
  dijkstra,
  bfs,
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
}: ComparisonProps) {
  // Data for comparison chart
  const comparisonData = [
    {
      name: "Travel Time",
      Dijkstra: dijkstra.distance,
      BFS: bfs.distance,
      difference: timeDifference,
    },
    {
      name: "Path Length",
      Dijkstra: dijkstra.path.length,
      BFS: bfs.path.length,
      difference: pathLengthDifference,
    },
    {
      name: "Nodes Explored",
      Dijkstra: dijkstra.nodesExplored,
      BFS: bfs.nodesExplored,
      difference: nodesExploredDifference,
    },
    {
      name: "Execution Time (ms)",
      Dijkstra: dijkstra.executionTimeMs,
      BFS: bfs.executionTimeMs,
      difference: executionTimeDifferenceMs,
    },
    {
      name: "Queue Operations",
      Dijkstra: dijkstra.priorityQueueOperations,
      BFS: bfs.queueOperations,
      difference: operationsDifference,
    },
    {
      name: "Edges Processed",
      Dijkstra: dijkstra.edgesProcessed,
      BFS: bfs.edgesProcessed,
      difference: edgesProcessedDifference,
    },
  ];

  // Data for steps comparison
  const stepsData = [
    { name: "Dijkstra", steps: dijkstra.steps.length },
    { name: "BFS", steps: bfs.steps.length },
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <BarChartIcon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Algorithm Comparison</h3>
        </div>
        <Badge
          variant={isPathIdentical ? "outline" : "secondary"}
          className="text-xs"
        >
          {isPathIdentical ? "Identical Paths" : "Different Paths"}
        </Badge>
      </div>

      {/* Key metrics in a compact row */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Travel Time Difference
          </div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(timeDifference)}
            <span className="text-xs ml-1">min</span>
            {timeDifference !== 0 && (
              <Badge
                variant={timeDifference > 0 ? "destructive" : "default"}
                className="ml-1 text-[10px]"
              >
                {timeDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Path Length Difference
          </div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(pathLengthDifference)}
            <span className="text-xs ml-1">stations</span>
            {pathLengthDifference !== 0 && (
              <Badge
                variant={pathLengthDifference > 0 ? "destructive" : "default"}
                className="ml-1 text-[10px]"
              >
                {pathLengthDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Nodes Explored Difference
          </div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(nodesExploredDifference)}
            <span className="text-xs ml-1">nodes</span>
            {nodesExploredDifference !== 0 && (
              <Badge
                variant={
                  nodesExploredDifference > 0 ? "destructive" : "default"
                }
                className="ml-1 text-[10px]"
              >
                {nodesExploredDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for additional details */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-8">
          <TabsTrigger value="chart" className="text-xs">
            Comparison Chart
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="complexity" className="text-xs">
            Complexity
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs">
            Algorithm Features
          </TabsTrigger>
        </TabsList>

        {/* Chart tab */}
        <TabsContent value="chart" className="mt-2 p-0">
          <div className="border rounded-md overflow-hidden">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    angle={0}
                    textAnchor="middle"
                    height={20}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="Dijkstra" fill="#ef4444" name="Dijkstra" />
                  <Bar dataKey="BFS" fill="#3b82f6" name="BFS" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Performance Metrics tab */}
        <TabsContent value="performance" className="mt-2 p-0">
          <div className="border rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Execution Time */}
              <div className="border rounded-md p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <p className="text-xs font-medium">Execution Time</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">
                      Dijkstra:
                    </p>
                    <p className="font-mono">
                      {dijkstra.executionTimeMs.toFixed(3)} ms
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">BFS:</p>
                    <p className="font-mono">
                      {bfs.executionTimeMs.toFixed(3)} ms
                    </p>
                  </div>
                </div>
                <div className="mt-1 p-1 bg-muted/20 rounded text-[10px]">
                  <p className="flex justify-between">
                    <span>Difference:</span>
                    <span
                      className={
                        executionTimeDifferenceMs > 0
                          ? "text-red-500"
                          : "text-blue-500"
                      }
                    >
                      {Math.abs(executionTimeDifferenceMs).toFixed(3)} ms{" "}
                      {executionTimeDifferenceMs > 0
                        ? "(Dijkstra slower)"
                        : "(BFS slower)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Data Structure Operations */}
              <div className="border rounded-md p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Cpu className="h-3 w-3 text-primary" />
                  <p className="text-xs font-medium">
                    Data Structure Operations
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">
                      Dijkstra (PQ):
                    </p>
                    <p className="font-mono">
                      {dijkstra.priorityQueueOperations} ops
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">
                      BFS (Queue):
                    </p>
                    <p className="font-mono">{bfs.queueOperations} ops</p>
                  </div>
                </div>
                <div className="mt-1 p-1 bg-muted/20 rounded text-[10px]">
                  <p className="flex justify-between">
                    <span>Difference:</span>
                    <span
                      className={
                        operationsDifference > 0
                          ? "text-red-500"
                          : "text-blue-500"
                      }
                    >
                      {Math.abs(operationsDifference)} ops{" "}
                      {operationsDifference > 0
                        ? "(Dijkstra more)"
                        : "(BFS more)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Edges Processed */}
              <div className="border rounded-md p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Network className="h-3 w-3 text-primary" />
                  <p className="text-xs font-medium">Edges Processed</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">
                      Dijkstra:
                    </p>
                    <p className="font-mono">{dijkstra.edgesProcessed} edges</p>
                  </div>
                  <div className="bg-blue-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">BFS:</p>
                    <p className="font-mono">{bfs.edgesProcessed} edges</p>
                  </div>
                </div>
                <div className="mt-1 p-1 bg-muted/20 rounded text-[10px]">
                  <p className="flex justify-between">
                    <span>Difference:</span>
                    <span
                      className={
                        edgesProcessedDifference > 0
                          ? "text-red-500"
                          : "text-blue-500"
                      }
                    >
                      {Math.abs(edgesProcessedDifference)} edges{" "}
                      {edgesProcessedDifference > 0
                        ? "(Dijkstra more)"
                        : "(BFS more)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="border rounded-md p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Cpu className="h-3 w-3 text-primary" />
                  <p className="text-xs font-medium">Memory Usage (est.)</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">
                      Dijkstra:
                    </p>
                    <p className="font-mono">
                      {(dijkstra.memoryUsageEstimate / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-1 rounded text-xs">
                    <p className="text-[10px] text-muted-foreground">BFS:</p>
                    <p className="font-mono">
                      {(bfs.memoryUsageEstimate / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="mt-1 p-1 bg-muted/20 rounded text-[10px]">
                  <p className="flex justify-between">
                    <span>Difference:</span>
                    <span
                      className={
                        memoryUsageDifference > 0
                          ? "text-red-500"
                          : "text-blue-500"
                      }
                    >
                      {Math.abs(memoryUsageDifference / 1024).toFixed(2)} KB{" "}
                      {memoryUsageDifference > 0
                        ? "(Dijkstra more)"
                        : "(BFS more)"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="mt-2 p-2 border rounded-md">
              <h4 className="text-xs font-medium mb-2">
                Advanced Efficiency Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-1 bg-muted/20 rounded text-[10px]">
                  <p className="font-medium">Operations per millisecond:</p>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="bg-red-500/10 p-1 rounded">
                      <p>
                        Dijkstra:{" "}
                        {(
                          dijkstra.priorityQueueOperations /
                          (dijkstra.executionTimeMs || 1)
                        ).toFixed(2)}{" "}
                        ops/ms
                      </p>
                    </div>
                    <div className="bg-blue-500/10 p-1 rounded">
                      <p>
                        BFS:{" "}
                        {(
                          bfs.queueOperations / (bfs.executionTimeMs || 1)
                        ).toFixed(2)}{" "}
                        ops/ms
                      </p>
                    </div>
                  </div>
                  <p className="mt-1">
                    Speed ratio: {speedRatio.toFixed(2)}x{" "}
                    {speedRatio > 1
                      ? "in favor of Dijkstra"
                      : "in favor of BFS"}
                  </p>
                </div>

                <div className="p-1 bg-muted/20 rounded text-[10px]">
                  <p className="font-medium">
                    Search efficiency (path/explored):
                  </p>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="bg-red-500/10 p-1 rounded">
                      <p>
                        Dijkstra:{" "}
                        {(
                          dijkstra.path.length / (dijkstra.nodesExplored || 1)
                        ).toFixed(3)}
                      </p>
                    </div>
                    <div className="bg-blue-500/10 p-1 rounded">
                      <p>
                        BFS:{" "}
                        {(bfs.path.length / (bfs.nodesExplored || 1)).toFixed(
                          3
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1">
                    Efficiency ratio: {efficiencyRatio.toFixed(2)}x{" "}
                    {efficiencyRatio > 1
                      ? "in favor of Dijkstra"
                      : "in favor of BFS"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Complexity tab */}
        <TabsContent value="complexity" className="mt-2 p-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-primary" />
                <p className="text-xs font-medium">Time Complexity</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1 flex-1">
                  Dijkstra: {dijkstra.timeComplexity}
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1 flex-1">
                  BFS: {bfs.timeComplexity}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                BFS has better time complexity in unweighted graphs, while
                Dijkstra is optimal for weighted graphs.
              </p>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <Cpu className="h-3 w-3 text-primary" />
                <p className="text-xs font-medium">Space Complexity</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1 flex-1">
                  Dijkstra: {dijkstra.spaceComplexity}
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1 flex-1">
                  BFS: {bfs.spaceComplexity}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Both algorithms have similar space complexity, but Dijkstra's
                priority queue may use more memory.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Features tab */}
        <TabsContent value="features" className="mt-2 p-0">
          <div className="border rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/20 p-2 rounded">
                <h4 className="text-xs font-medium mb-1">
                  Dijkstra's Algorithm
                </h4>
                <ul className="text-[10px] space-y-1">
                  <li>• Optimal for weighted graphs</li>
                  <li>• Uses priority queue for efficiency</li>
                  <li>• Guarantees shortest path by travel time</li>
                  <li>• More complex implementation</li>
                  <li>• Higher computational overhead</li>
                </ul>
              </div>
              <div className="bg-muted/20 p-2 rounded">
                <h4 className="text-xs font-medium mb-1">
                  Breadth-First Search
                </h4>
                <ul className="text-[10px] space-y-1">
                  <li>• Optimal for unweighted graphs</li>
                  <li>• Uses simple queue data structure</li>
                  <li>• Guarantees fewest stations (if all weights equal)</li>
                  <li>• Simpler implementation</li>
                  <li>• Lower computational overhead</li>
                </ul>
              </div>
            </div>
            <div className="mt-2 p-2 bg-muted/10 rounded text-[10px]">
              <p className="font-medium mb-1">When to use which algorithm?</p>
              <p>
                <strong>Dijkstra:</strong> When edge weights matter (travel
                time, distance, cost) and you need the optimal path.
              </p>
              <p>
                <strong>BFS:</strong> When all edges have equal weight or you
                just need the path with fewest edges/stops.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
