import { type Edge, type Node } from "@xyflow/react";
import { STORAGE_KEY } from "./constants";

type PersistedGraph = {
  nodes: Node[];
  edges: Edge[];
  savedAt: number;
};

export function saveGraph(nodes: Node[], edges: Edge[]): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedGraph = { nodes, edges, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function loadGraph(): { nodes: Node[]; edges: Edge[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedGraph>;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges))
      return null;
    return { nodes: parsed.nodes, edges: parsed.edges };
  } catch {
    return null;
  }
}

export function clearGraph(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
