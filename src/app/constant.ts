export const INITIAL_NODES = [
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
] as const;
export const INITIAL_EDGES = [
  {
    id: "edge_a",
    source: "node_1",
    target: "node_2",
  },
  {
    id: "edge_b",
    source: "node_2",
    target: "node_3",
  },
] as const;
