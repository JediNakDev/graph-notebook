import { type Edge, type Node } from "@xyflow/react";
import { z } from "zod";
import { STORAGE_KEY } from "./constants";

const nodeSchema = z
  .object({
    id: z.string(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })
  .passthrough();

const persistedGraphSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

type PersistedGraph = z.infer<typeof persistedGraphSchema>;

export function saveGraph(nodes: Node[], edges: Edge[]): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedGraph = { nodes, edges };
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
    const parsed = persistedGraphSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.warn("[graph_storage] discarding invalid saved state", parsed.error.issues);
      return null;
    }
    return { nodes: parsed.data.nodes as Node[], edges: parsed.data.edges as Edge[] };
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
