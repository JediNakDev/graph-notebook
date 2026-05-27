import { type Edge, type Node } from "@xyflow/react";
import { type Dispatch, type SetStateAction } from "react";

export type GraphCommandContext = {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onLog?: (message: string) => void;
};

export function executeCommand(text: string, ctx: GraphCommandContext): void {
  const { nodes, setNodes, setEdges, onLog } = ctx;
  const list = text.trim().split(/\s+/);
  const cmd = list[0]?.toLowerCase();
  const subject = list[1]?.toLowerCase();

  if (cmd === "add" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label) return;
    const id = `node_${crypto.randomUUID()}`;
    setNodes((prev) => [
      ...prev,
      {
        id,
        data: { label },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      },
    ]);
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
    setEdges((prev) => [
      ...prev,
      { id: `edge_${crypto.randomUUID()}`, source, target },
    ]);
    onLog?.(`${sourceLabel} → ${targetLabel}`);
    return;
  }

  if (cmd === "remove" && subject === "node") {
    const label = list.slice(2).join(" ");
    if (!label) return;
    const ids = nodes.filter((n) => n.data.label === label).map((n) => n.id);
    if (!ids.length) return;
    setNodes((prev) => prev.filter((n) => !ids.includes(n.id)));
    setEdges((prev) =>
      prev.filter((e) => !ids.includes(e.source) && !ids.includes(e.target)),
    );
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
    setEdges((prev) =>
      prev.filter((e) => e.source !== source || e.target !== target),
    );
    onLog?.(`removed edge ${sourceLabel} ⇸ ${targetLabel}`);
  }
}
