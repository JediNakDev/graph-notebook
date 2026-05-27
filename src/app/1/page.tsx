"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { JetBrains_Mono, VT323 } from "next/font/google";
import { useCallback, useState, type CSSProperties } from "react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const crt = VT323({ subsets: ["latin"], weight: "400" });

const INITIAL_NODES: Node[] = [
  { id: "node_1", position: { x: 0, y: 220 }, data: { label: "Internet" }, type: "ascii" },
  { id: "node_2", position: { x: 260, y: 220 }, data: { label: "Web Server" }, type: "ascii" },
  { id: "node_3", position: { x: 520, y: 220 }, data: { label: "Database" }, type: "ascii" },
];
const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "node_1", target: "node_2", animated: true, style: { stroke: "#00ff66", strokeWidth: 1.5 } },
  { id: "e2", source: "node_2", target: "node_3", animated: true, style: { stroke: "#00ff66", strokeWidth: 1.5 } },
];

function AsciiNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative px-5 py-3 bg-black border border-[#00ff66] text-[#00ff66] uppercase tracking-[0.18em] text-[12px] font-bold shadow-[0_0_0_1px_#003318,_0_0_24px_-2px_#00ff6655]">
      <span className="absolute -top-1 -left-1 text-[#00ff66]">+</span>
      <span className="absolute -top-1 -right-1 text-[#00ff66]">+</span>
      <span className="absolute -bottom-1 -left-1 text-[#00ff66]">+</span>
      <span className="absolute -bottom-1 -right-1 text-[#00ff66]">+</span>
      <Handle type="target" position={Position.Left} style={{ background: "#00ff66", width: 8, height: 8, border: 0, borderRadius: 0 }} />
      <span className="text-[#00ff66]/40 mr-2">&gt;</span>{data.label}
      <Handle type="source" position={Position.Right} style={{ background: "#00ff66", width: 8, height: 8, border: 0, borderRadius: 0 }} />
    </div>
  );
}

const nodeTypes = { ascii: AsciiNode };

const scanlines: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(0,255,102,0.05) 0px, rgba(0,255,102,0.05) 1px, transparent 1px, transparent 3px)",
};

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<string[]>([
    "BOOT > kernel v0.4.1 ok",
    "BOOT > mounting /graph ok",
    "READY.",
  ]);

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge({ ...p, animated: true, style: { stroke: "#00ff66" } }, s)), []);

  const log = (m: string) => setHistory((h) => [...h.slice(-8), m]);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    log(`$ ${text}`);
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), type: "ascii", data: { label }, position: { x: Math.random() * 400, y: Math.random() * 300 } }]);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to");
      if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      if (s && t) setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t, animated: true, style: { stroke: "#00ff66" } }]);
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      const ids = nodes.filter((n) => n.data.label === label).map((n) => n.id);
      setNodes((p) => p.filter((n) => !ids.includes(n.id)));
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to");
      if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      setEdges((p) => p.filter((n) => n.source !== s || n.target !== t));
    }
    setText("");
  };

  return (
    <div className={`${mono.className} min-h-screen bg-black text-[#00ff66] relative overflow-hidden`}>
      <div className="pointer-events-none fixed inset-0 z-50" style={scanlines} />
      <div className="pointer-events-none fixed inset-0 z-50 [background:radial-gradient(ellipse_at_center,transparent_50%,#000_140%)]" />

      <header className="border-b border-[#00ff66]/30 px-6 py-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
        <div className="flex gap-6">
          <span className="text-[#00ff66]">◼ GRAPH.SYS</span>
          <span className="text-[#00ff66]/40">v0.4.1</span>
        </div>
        <div className="flex gap-6 text-[#00ff66]/60">
          <span>NODES {nodes.length.toString().padStart(3, "0")}</span>
          <span>EDGES {edges.length.toString().padStart(3, "0")}</span>
          <span className="animate-pulse">● ONLINE</span>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_320px]">
        <div className="h-[calc(100vh-49px)] border-r border-[#00ff66]/30 relative">
          <div className="absolute top-3 left-4 z-10 text-[10px] uppercase tracking-[0.3em] text-[#00ff66]/50">
            ┌── viewport :: /dev/graph0
          </div>
          <div className="absolute bottom-3 left-4 z-10 text-[10px] uppercase tracking-[0.3em] text-[#00ff66]/40">
            └── drag.connect.observe
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            style={{ background: "#000" }}
            proOptions={{ hideAttribution: true }}
          >
            <Controls style={{ background: "#000", border: "1px solid #00ff6655", borderRadius: 0 }} />
            <Background color="#00ff6622" gap={24} size={1} />
          </ReactFlow>
        </div>

        <aside className="h-[calc(100vh-49px)] flex flex-col">
          <div className={`${crt.className} flex-1 p-4 text-[18px] leading-[1.4] overflow-auto`}>
            <div className="text-[#00ff66]/40 mb-3 text-[14px] uppercase tracking-[0.2em]">// terminal log</div>
            {history.map((h, i) => (
              <div key={i} className="text-[#00ff66]">{h}</div>
            ))}
            <div className="text-[#00ff66]">
              <span className="text-[#00ff66]/60">_</span>
              <span className="inline-block w-2 h-4 bg-[#00ff66] ml-1 animate-pulse align-middle" />
            </div>
          </div>

          <div className="border-t border-[#00ff66]/30">
            <div className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#00ff66]/50 border-b border-[#00ff66]/20">
              ── INPUT ──────────────
            </div>
            <div className="flex items-center px-3 py-3 gap-2">
              <span className="text-[#00ff66]/70">$</span>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && exec()}
                placeholder="add node Cache"
                className="flex-1 bg-transparent outline-none text-[#00ff66] placeholder-[#00ff66]/30 caret-[#00ff66] text-[13px]"
              />
              <button onClick={exec} className="text-[10px] uppercase tracking-[0.3em] border border-[#00ff66]/60 px-3 py-1 hover:bg-[#00ff66] hover:text-black transition-colors">
                EXEC ⏎
              </button>
            </div>
          </div>

          <div className="border-t border-[#00ff66]/30 p-4 text-[10px] uppercase tracking-[0.25em] text-[#00ff66]/60 leading-relaxed">
            <div className="text-[#00ff66] mb-2">▣ MAN(1) GRAPH</div>
            <div>· add node &lt;label&gt;</div>
            <div>· remove node &lt;label&gt;</div>
            <div>· add edge from &lt;a&gt; to &lt;b&gt;</div>
            <div>· remove edge from &lt;a&gt; to &lt;b&gt;</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
