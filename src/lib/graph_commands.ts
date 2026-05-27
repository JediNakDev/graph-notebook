import { type Edge, type Node } from "@xyflow/react";
import { type Dispatch, type SetStateAction } from "react";
import { saveGraph } from "./graph_storage";

export type GraphCommandContext = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onLog?: (message: string) => void;
};

export function executeCommand(text: string, ctx: GraphCommandContext): void {
  const { nodes, edges, setNodes, setEdges, onLog } = ctx;
  const list = text.trim().split(/\s+/);
  const cmd = list[0]?.toLowerCase();
  const subject = list[1]?.toLowerCase();

  if (cmd === "add" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label) return;
    const newNode: Node = {
      id: `node_${crypto.randomUUID()}`,
      data: { label },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    saveGraph(nextNodes, edges);
    onLog?.(`added node "${label}"`);
    return;
  }

  if (cmd === "add" && subject === "edge" && list[2]?.toLowerCase() === "from") {
    const toIdx = list.indexOf("to");
    if (toIdx < 0) return;
    const sourceLabel = list.slice(3, toIdx).join(" ");
    const targetLabel = list.slice(toIdx + 1).join(" ");
    const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
    const target = nodes.find((n) => n.data.label === targetLabel)?.id;
    if (!source || !target) return;
    const newEdge: Edge = {
      id: `edge_${crypto.randomUUID()}`,
      source,
      target,
    };
    const nextEdges = [...edges, newEdge];
    setEdges(nextEdges);
    saveGraph(nodes, nextEdges);
    onLog?.(`${sourceLabel} → ${targetLabel}`);
    return;
  }

  if (cmd === "remove" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label) return;
    const ids = new Set(
      nodes.filter((n) => n.data.label === label).map((n) => n.id),
    );
    if (ids.size === 0) return;
    const nextNodes = nodes.filter((n) => !ids.has(n.id));
    const nextEdges = edges.filter(
      (e) => !ids.has(e.source) && !ids.has(e.target),
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
    saveGraph(nextNodes, nextEdges);
    onLog?.(`removed node "${label}"`);
    return;
  }

  if (cmd === "remove" && subject === "edge" && list[2]?.toLowerCase() === "from") {
    const toIdx = list.indexOf("to");
    if (toIdx < 0) return;
    const sourceLabel = list.slice(3, toIdx).join(" ");
    const targetLabel = list.slice(toIdx + 1).join(" ");
    const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
    const target = nodes.find((n) => n.data.label === targetLabel)?.id;
    if (!source || !target) return;
    const nextEdges = edges.filter(
      (e) => e.source !== source || e.target !== target,
    );
    if (nextEdges.length === edges.length) return;
    setEdges(nextEdges);
    saveGraph(nodes, nextEdges);
    onLog?.(`removed edge ${sourceLabel} ⇸ ${targetLabel}`);
  }
}
