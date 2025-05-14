"use client";
// @ts-nocheck

import { useRef, useEffect, useState, useCallback } from "react";
import { Graph, Edge, Node } from "@/lib/utils";
import { DijkstraStep } from "@/lib/dijkstra";
import { BFSStep } from "@/lib/bfs";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define types for D3 nodes and links
interface D3Node extends Node {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

interface D3Link {
  source: D3Node | string;
  target: D3Node | string;
  weight: number;
  index?: number;
}

// Define a union type for algorithm steps
type AlgorithmStep = DijkstraStep | BFSStep;

type GraphVisualizationProps = {
  steps: AlgorithmStep[];
  path: string[];
  graph: Graph;
  currentStepIndex: number;
  algorithmName?: "dijkstra" | "bfs";
};

export function GraphVisualization({
  steps,
  path,
  graph,
  currentStepIndex,
  algorithmName = "dijkstra",
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null);

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

  // Get node status for current step
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

  // Get edge status for current step
  const getEdgeClass = (edge: Edge) => {
    if (!currentStep) return "edge-unvisited";

    const sourceVisited = currentStep.visitedNodes.includes(edge.source);
    const targetVisited = currentStep.visitedNodes.includes(edge.target);

    // Check if this edge is part of the final path
    if (currentStepIndex === steps.length - 1) {
      let isPathEdge = false;
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (path[i] === edge.source && path[i + 1] === edge.target) ||
          (path[i] === edge.target && path[i + 1] === edge.source)
        ) {
          isPathEdge = true;
          break;
        }
      }
      if (isPathEdge) return "edge-path";
    }

    // Edge from current node being processed
    if (
      edge.source === currentStep.currentNode ||
      edge.target === currentStep.currentNode
    ) {
      return "edge-current";
    }

    // Edge between two visited nodes
    if (sourceVisited && targetVisited) {
      return "edge-visited";
    }

    // Edge from a visited node to an unvisited node
    if (sourceVisited || targetVisited) {
      return "edge-frontier";
    }

    return "edge-unvisited";
  };

  // Get node distance for current step
  const getNodeDistance = (nodeId: string) => {
    if (!currentStep) return "Infinity";
    const distance = currentStep.distances[nodeId];
    return distance === Infinity ? "∞" : distance.toString();
  };

  // Get previous node for current step
  const getPreviousNode = (nodeId: string) => {
    if (!currentStep) return null;
    return currentStep.previousNodes[nodeId];
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get node class as a memoized function
  const getNodeClassMemo = useCallback(
    (nodeId: string) => {
      return getNodeClass(nodeId);
    },
    [currentStep, currentStepIndex, path]
  );

  // Get edge class as a memoized function
  const getEdgeClassMemo = useCallback(
    (edge: Edge) => {
      return getEdgeClass(edge);
    },
    [currentStep, currentStepIndex, path]
  );

  // D3 force simulation
  useEffect(() => {
    if (
      !svgRef.current ||
      dimensions.width === 0 ||
      visualizationNodes.length === 0
    )
      return;

    // Clear previous simulation
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Create deep copies of the nodes and edges to avoid modifying the original data
    const nodesCopy: D3Node[] = JSON.parse(JSON.stringify(visualizationNodes));
    const edgesCopy: Edge[] = JSON.parse(JSON.stringify(visualizationEdges));

    // Create a node map for edge resolution
    const nodeMap = new Map<string, D3Node>();
    nodesCopy.forEach((node) => {
      nodeMap.set(node.id, node);
    });

    // Create a force simulation
    const simulation = d3
      .forceSimulation<D3Node>()
      .force(
        "link",
        d3
          .forceLink<D3Node, D3Link>()
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(40))
      .alphaDecay(0.1) // Increase decay rate to stabilize faster
      .velocityDecay(0.6); // Increase velocity decay to reduce oscillation

    // Create the links (edges)
    const links = svg
      .append("g")
      .selectAll("line")
      .data(edgesCopy)
      .enter()
      .append("line")
      .attr("class", (d) => `graph-edge ${getEdgeClassMemo(d)}`)
      .attr("stroke-width", 2)
      .on("mouseenter", (event, d) => setHoveredEdge(d))
      .on("mouseleave", () => setHoveredEdge(null));

    // Create the edge weight labels
    const edgeLabels = svg
      .append("g")
      .selectAll("text")
      .data(edgesCopy)
      .enter()
      .append("text")
      .attr("class", "edge-weight")
      .text((d) => d.weight)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .attr("opacity", 0.7);

    // Create the nodes
    const nodes = svg
      .append("g")
      .selectAll("circle")
      .data(nodesCopy)
      .enter()
      .append("circle")
      .attr("class", (d) => `graph-node ${getNodeClassMemo(d.id)}`)
      .attr("r", 15)
      .on("mouseenter", (event, d) => setHoveredNode(d.id))
      .on("mouseleave", () => setHoveredNode(null))
      .call(
        d3
          .drag<SVGCircleElement, D3Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Create the node labels
    const nodeLabels = svg
      .append("g")
      .selectAll("text")
      .data(nodesCopy)
      .enter()
      .append("text")
      .attr("class", "node-label")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .attr("font-weight", "bold");

    // Update positions on each tick
    let tickCount = 0;
    const maxTicks = 300; // Limit the number of ticks to prevent endless simulation

    simulation.nodes(nodesCopy).on("tick", () => {
      tickCount++;

      // Update link positions
      links
        .attr("x1", (d) => {
          const source =
            typeof d.source === "string"
              ? nodeMap.get(d.source)
              : (d.source as D3Node);
          return source?.x || 0;
        })
        .attr("y1", (d) => {
          const source =
            typeof d.source === "string"
              ? nodeMap.get(d.source)
              : (d.source as D3Node);
          return source?.y || 0;
        })
        .attr("x2", (d) => {
          const target =
            typeof d.target === "string"
              ? nodeMap.get(d.target)
              : (d.target as D3Node);
          return target?.x || 0;
        })
        .attr("y2", (d) => {
          const target =
            typeof d.target === "string"
              ? nodeMap.get(d.target)
              : (d.target as D3Node);
          return target?.y || 0;
        });

      // Update edge label positions
      edgeLabels
        .attr("x", (d) => {
          const source =
            typeof d.source === "string"
              ? nodeMap.get(d.source)
              : (d.source as D3Node);
          const target =
            typeof d.target === "string"
              ? nodeMap.get(d.target)
              : (d.target as D3Node);
          return ((source?.x || 0) + (target?.x || 0)) / 2;
        })
        .attr("y", (d) => {
          const source =
            typeof d.source === "string"
              ? nodeMap.get(d.source)
              : (d.source as D3Node);
          const target =
            typeof d.target === "string"
              ? nodeMap.get(d.target)
              : (d.target as D3Node);
          return ((source?.y || 0) + (target?.y || 0)) / 2;
        });

      // Update node positions
      nodes.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);

      // Update node label positions
      nodeLabels.attr("x", (d) => d.x || 0).attr("y", (d) => d.y || 0);

      // Stop the simulation after it has stabilized or reached max ticks
      if (simulation.alpha() < 0.01 || tickCount >= maxTicks) {
        simulation.stop();

        // Fix node positions to prevent further movement
        nodesCopy.forEach((node) => {
          if (node.x && node.y) {
            node.fx = node.x;
            node.fy = node.y;
          }
        });
      }
    });

    // Add the link force and prepare the links
    const linkForce = simulation.force<d3.ForceLink<D3Node, D3Link>>("link");
    if (linkForce) {
      // Create proper D3Links with resolved node references
      const d3Links: D3Link[] = edgesCopy.map((edge) => ({
        source: nodeMap.get(edge.source) || edge.source,
        target: nodeMap.get(edge.target) || edge.target,
        weight: edge.weight,
      }));

      linkForce.links(d3Links);
    }

    // Drag functions
    function dragstarted(
      event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>,
      d: D3Node
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>,
      d: D3Node
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>,
      d: D3Node
    ) {
      if (!event.active) {
        simulation.alphaTarget(0);
        // Keep the node fixed at its final position
        // This prevents nodes from moving after being dragged
        d.fx = event.x;
        d.fy = event.y;
      }
    }

    return () => {
      simulation.stop();
    };
  }, [
    dimensions,
    currentStepIndex,
    getNodeClassMemo,
    getEdgeClassMemo,
    visualizationNodes,
    visualizationEdges,
  ]);

  return (
    <div className="relative border rounded-md h-[400px] overflow-hidden bg-muted/10">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="graph-visualization"
      >
        {/* D3 will render here */}
      </svg>

      {/* Node info tooltip */}
      {hoveredNode && (
        <div
          className="absolute bg-background border rounded-md shadow-md p-2 text-xs z-10"
          style={{
            top: "10px",
            right: "10px",
            maxWidth: "200px",
          }}
        >
          <div className="font-medium mb-1">
            Node: {hoveredNode} -{" "}
            {visualizationNodes.find((n) => n.id === hoveredNode)?.name}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>Status:</div>
            <div className="font-medium">
              {getNodeClass(hoveredNode) === "node-path"
                ? "Path"
                : getNodeClass(hoveredNode) === "node-current"
                ? "Current"
                : getNodeClass(hoveredNode) === "node-visited"
                ? "Visited"
                : "Unvisited"}
            </div>

            <div>Distance:</div>
            <div className="font-medium">{getNodeDistance(hoveredNode)}</div>

            <div>Previous:</div>
            <div className="font-medium">
              {getPreviousNode(hoveredNode) || "-"}
            </div>
          </div>
        </div>
      )}

      {/* Edge info tooltip */}
      {hoveredEdge && (
        <div
          className="absolute bg-background border rounded-md shadow-md p-2 text-xs z-10"
          style={{
            bottom: "10px",
            right: "10px",
            maxWidth: "200px",
          }}
        >
          <div className="font-medium mb-1">
            Edge: {hoveredEdge.source} → {hoveredEdge.target}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>Weight:</div>
            <div className="font-medium">{hoveredEdge.weight} minutes</div>

            <div>Status:</div>
            <div className="font-medium">
              {getEdgeClass(hoveredEdge) === "edge-path"
                ? "Path"
                : getEdgeClass(hoveredEdge) === "edge-current"
                ? "Current"
                : getEdgeClass(hoveredEdge) === "edge-visited"
                ? "Visited"
                : getEdgeClass(hoveredEdge) === "edge-frontier"
                ? "Frontier"
                : "Unvisited"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
