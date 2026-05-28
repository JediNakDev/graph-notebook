import { type Edge, type Node } from "@xyflow/react";
import { type Dispatch, type SetStateAction } from "react";
import { INITIAL_EDGES, INITIAL_NODES } from "./constants";
import { saveGraph } from "./graph_storage";

export type GraphCommandContext = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onLog?: (message: string) => void;
};

export type CommandResult =
  | { status: "noop" }
  | { status: "ok" }
  | { status: "error"; message: string }
  | { status: "confirm"; message: string; run: () => void };

export function executeCommand(
  text: string,
  ctx: GraphCommandContext,
): CommandResult {
  const trimmed = text.trim();
  if (!trimmed) return { status: "noop" };

  const list = trimmed.split(/\s+/);
  const cmd = list[0]?.toLowerCase();
  const subject = list[1]?.toLowerCase();
  const { nodes, edges, setNodes, setEdges, onLog } = ctx;

  if (cmd === "reset") {
    return {
      status: "confirm",
      message: "Return to the original graph?",
      run: () => {
        setNodes(INITIAL_NODES);
        setEdges(INITIAL_EDGES);
        saveGraph(INITIAL_NODES, INITIAL_EDGES);
        onLog?.("reset to initial state");
      },
    };
  }

  if (cmd === "add" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label)
      return { status: "error", message: "node needs a label. try: add node Cache" };
    const newNode: Node = {
      id: `node_${crypto.randomUUID()}`,
      data: { label },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    saveGraph(nextNodes, edges);
    onLog?.(`added node "${label}"`);
    return { status: "ok" };
  }

  if (cmd === "add" && subject === "edge" && list[2]?.toLowerCase() === "from") {
    const toIdx = list.indexOf("to");
    if (toIdx < 0)
      return { status: "error", message: "use: add edge from <a> to <b>" };
    const sourceLabel = list.slice(3, toIdx).join(" ");
    const targetLabel = list.slice(toIdx + 1).join(" ");
    if (!sourceLabel || !targetLabel)
      return { status: "error", message: "missing node label on either side of 'to'" };
    const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
    const target = nodes.find((n) => n.data.label === targetLabel)?.id;
    if (!source)
      return { status: "error", message: `no node named "${sourceLabel}"` };
    if (!target)
      return { status: "error", message: `no node named "${targetLabel}"` };
    const newEdge: Edge = { id: `edge_${crypto.randomUUID()}`, source, target };
    const nextEdges = [...edges, newEdge];
    setEdges(nextEdges);
    saveGraph(nodes, nextEdges);
    onLog?.(`${sourceLabel} → ${targetLabel}`);
    return { status: "ok" };
  }

  if (cmd === "remove" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label)
      return { status: "error", message: "which node? try: remove node Cache" };
    const ids = new Set(
      nodes.filter((n) => n.data.label === label).map((n) => n.id),
    );
    if (ids.size === 0)
      return { status: "error", message: `no node named "${label}"` };
    const nextNodes = nodes.filter((n) => !ids.has(n.id));
    const nextEdges = edges.filter(
      (e) => !ids.has(e.source) && !ids.has(e.target),
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
    saveGraph(nextNodes, nextEdges);
    onLog?.(`removed node "${label}"`);
    return { status: "ok" };
  }

  if (cmd === "remove" && subject === "edge" && list[2]?.toLowerCase() === "from") {
    const toIdx = list.indexOf("to");
    if (toIdx < 0)
      return { status: "error", message: "use: remove edge from <a> to <b>" };
    const sourceLabel = list.slice(3, toIdx).join(" ");
    const targetLabel = list.slice(toIdx + 1).join(" ");
    const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
    const target = nodes.find((n) => n.data.label === targetLabel)?.id;
    if (!source)
      return { status: "error", message: `no node named "${sourceLabel}"` };
    if (!target)
      return { status: "error", message: `no node named "${targetLabel}"` };
    const nextEdges = edges.filter(
      (e) => e.source !== source || e.target !== target,
    );
    if (nextEdges.length === edges.length)
      return { status: "error", message: `no edge from "${sourceLabel}" to "${targetLabel}"` };
    setEdges(nextEdges);
    saveGraph(nodes, nextEdges);
    onLog?.(`removed edge ${sourceLabel} ⇸ ${targetLabel}`);
    return { status: "ok" };
  }

  return {
    status: "error",
    message: `didn't catch "${trimmed}". try add/remove node/edge or reset.`,
  };
}
