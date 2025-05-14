"use client";

import { DijkstraResult } from "@/lib/dijkstra";
import { BFSResult } from "@/lib/bfs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as BarChartIcon, Cpu, Clock, Network, ArrowRight, ArrowDown } from "lucide-react";
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
};

export function AlgorithmComparison({
  dijkstra,
  bfs,
  timeDifference,
  pathLengthDifference,
  nodesExploredDifference,
  isPathIdentical,
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
        <Badge variant={isPathIdentical ? "outline" : "secondary"} className="text-xs">
          {isPathIdentical ? "Identical Paths" : "Different Paths"}
        </Badge>
      </div>

      {/* Key metrics in a compact row */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">Travel Time Difference</div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(timeDifference)}
            <span className="text-xs ml-1">min</span>
            {timeDifference !== 0 && (
              <Badge variant={timeDifference > 0 ? "destructive" : "default"} className="ml-1 text-[10px]">
                {timeDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">Path Length Difference</div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(pathLengthDifference)}
            <span className="text-xs ml-1">stations</span>
            {pathLengthDifference !== 0 && (
              <Badge variant={pathLengthDifference > 0 ? "destructive" : "default"} className="ml-1 text-[10px]">
                {pathLengthDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">Nodes Explored Difference</div>
          <div className="text-xl font-bold flex items-center justify-center">
            {Math.abs(nodesExploredDifference)}
            <span className="text-xs ml-1">nodes</span>
            {nodesExploredDifference !== 0 && (
              <Badge variant={nodesExploredDifference > 0 ? "destructive" : "default"} className="ml-1 text-[10px]">
                {nodesExploredDifference > 0 ? "Dijkstra +" : "BFS +"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for additional details */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-8">
          <TabsTrigger value="chart" className="text-xs">
            Comparison Chart
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
                BFS has better time complexity in unweighted graphs, while Dijkstra is optimal for weighted graphs.
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
                Both algorithms have similar space complexity, but Dijkstra's priority queue may use more memory.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Features tab */}
        <TabsContent value="features" className="mt-2 p-0">
          <div className="border rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/20 p-2 rounded">
                <h4 className="text-xs font-medium mb-1">Dijkstra's Algorithm</h4>
                <ul className="text-[10px] space-y-1">
                  <li>• Optimal for weighted graphs</li>
                  <li>• Uses priority queue for efficiency</li>
                  <li>• Guarantees shortest path by travel time</li>
                  <li>• More complex implementation</li>
                  <li>• Higher computational overhead</li>
                </ul>
              </div>
              <div className="bg-muted/20 p-2 rounded">
                <h4 className="text-xs font-medium mb-1">Breadth-First Search</h4>
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
                <strong>Dijkstra:</strong> When edge weights matter (travel time, distance, cost) and you need the optimal path.
              </p>
              <p>
                <strong>BFS:</strong> When all edges have equal weight or you just need the path with fewest edges/stops.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
