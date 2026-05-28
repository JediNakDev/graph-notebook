"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function GraphDisplay({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  activeNodeId,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  activeNodeId?: string | null;
}) {
  const decorated = activeNodeId
    ? nodes.map((n) =>
        n.id === activeNodeId
          ? {
              ...n,
              style: {
                ...n.style,
                background: "#fffbf0",
                border: "1.5px solid #d96456",
                borderRadius: 2,
                boxShadow: "3px 4px 0 -1px rgba(217,100,86,0.35)",
                color: "#2a241c",
              },
            }
          : n,
      )
    : nodes;

  return (
    <ReactFlow
      nodes={decorated}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}
