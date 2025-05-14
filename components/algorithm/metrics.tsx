"use client";

import { DijkstraResult } from "@/lib/dijkstra";
import { BFSResult } from "@/lib/bfs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as BarChartIcon, Cpu, Clock, Network } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define a union type for algorithm results
type AlgorithmResult = DijkstraResult | BFSResult;

type MetricsProps = {
  result: AlgorithmResult;
};

export function AlgorithmMetrics({ result }: MetricsProps) {
  // Determine which algorithm was used
  const isUsingDijkstra =
    "timeComplexity" in result && result.timeComplexity.includes("log V");
  const nodesExplored = result.nodesExplored;
  const pathLength = result.path.length;
  const totalSteps = result.steps.length;

  // Data for charts
  const performanceData = [
    {
      name: "Nodes Explored",
      value: nodesExplored,
      fill: "hsl(var(--chart-1))",
    },
    { name: "Path Length", value: pathLength, fill: "hsl(var(--chart-2))" },
    { name: "Algorithm Steps", value: totalSteps, fill: "hsl(var(--chart-3))" },
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <BarChartIcon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Performance Metrics</h3>
        </div>
        <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
          {isUsingDijkstra ? "Dijkstra Algorithm" : "BFS Algorithm"}
        </div>
      </div>

      {/* Key metrics in a compact row */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">
            Nodes Explored
          </div>
          <div className="text-xl font-bold">{nodesExplored}</div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">Path Length</div>
          <div className="text-xl font-bold">{pathLength}</div>
        </div>
        <div className="bg-muted/20 rounded p-2 text-center">
          <div className="text-xs text-muted-foreground mb-1">Travel Time</div>
          <div className="text-xl font-bold">{result.distance}</div>
        </div>
      </div>

      {/* Tabs for additional details */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-8">
          <TabsTrigger value="chart" className="text-xs">
            Chart
          </TabsTrigger>
          <TabsTrigger value="complexity" className="text-xs">
            Complexity
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs">
            Features
          </TabsTrigger>
        </TabsList>

        {/* Chart tab */}
        <TabsContent value="chart" className="mt-2 p-0">
          <div className="border rounded-md overflow-hidden">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
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
                  <Bar dataKey="value" nameKey="name" radius={[2, 2, 0, 0]} />
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
                <p className="text-xs font-medium">Time</p>
              </div>
              <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1">
                {result.timeComplexity}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isUsingDijkstra
                  ? "O((V + E) log V) due to priority queue operations"
                  : "O(V + E) - more efficient than Dijkstra"}
              </p>
            </div>

            <div className="border rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <Cpu className="h-3 w-3 text-primary" />
                <p className="text-xs font-medium">Space</p>
              </div>
              <div className="bg-muted/20 p-1 rounded text-xs font-mono mb-1">
                {result.spaceComplexity}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isUsingDijkstra
                  ? "O(V) for distances, previous nodes, and priority queue"
                  : "O(V) for distances, previous nodes, and queue"}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Features tab */}
        <TabsContent value="features" className="mt-2 p-0">
          <div className="border rounded-md p-2">
            <div className="text-xs font-medium mb-1">Key Characteristics</div>
            <div className="space-y-1 text-[10px]">
              {isUsingDijkstra ? (
                <>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">Priority Queue:</span>{" "}
                      Processes nodes with smallest known distance first
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">Early Termination:</span>{" "}
                      Stops once destination is reached
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">Optimality:</span>{" "}
                      Guarantees shortest path with non-negative weights
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">FIFO Queue:</span> Processes
                      nodes in order of discovery
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">Level Exploration:</span>{" "}
                      Explores all nodes at current distance first
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">
                        Unweighted Optimality:
                      </span>{" "}
                      Finds fewest-edge path
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="text-primary mt-0.5">•</div>
                    <div>
                      <span className="font-medium">Simplicity:</span> Simpler
                      than Dijkstra but may not find optimal weighted path
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
