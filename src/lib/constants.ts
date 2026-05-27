import { type Edge, type Node } from "@xyflow/react";

/** localStorage key for persisted graph state. */
export const STORAGE_KEY = "graph_notebook_state_v1";

/** Seed nodes shown on first load (before localStorage hydration). */
export const INITIAL_NODES: Node[] = [
  {
    id: "node_1",
    position: { x: 0, y: 250 },
    data: { label: "Internet" },
  },
  {
    id: "node_2",
    position: { x: 250, y: 250 },
    data: { label: "Web Server" },
  },
  {
    id: "node_3",
    position: { x: 500, y: 250 },
    data: { label: "Database" },
  },
];

export const INITIAL_EDGES: Edge[] = [
  { id: "edge_a", source: "node_1", target: "node_2" },
  { id: "edge_b", source: "node_2", target: "node_3" },
];

export const INITIAL_JOT = [
  "Internet → Web Server → Database",
  "remember to label everything ✦",
];

export const PAPER_BG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
