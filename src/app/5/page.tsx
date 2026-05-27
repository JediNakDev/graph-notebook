"use client";

import {
  Background,
  BackgroundVariant,
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
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { useCallback, useState } from "react";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

const INITIAL_NODES: Node[] = [
  { id: "node_1", position: { x: 0, y: 220 }, data: { label: "Internet", spec: "REF-001" }, type: "spec" },
  { id: "node_2", position: { x: 280, y: 220 }, data: { label: "Web Server", spec: "REF-002" }, type: "spec" },
  { id: "node_3", position: { x: 560, y: 220 }, data: { label: "Database", spec: "REF-003" }, type: "spec" },
];
const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "node_1", target: "node_2", type: "step", style: { stroke: "#7dd3fc", strokeWidth: 1, strokeDasharray: "4 2" } },
  { id: "e2", source: "node_2", target: "node_3", type: "step", style: { stroke: "#7dd3fc", strokeWidth: 1, strokeDasharray: "4 2" } },
];

function SpecNode({ data }: { data: { label: string; spec?: string } }) {
  return (
    <div className="relative">
      <span className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-[#7dd3fc]" />
      <span className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-[#7dd3fc]" />
      <span className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-[#7dd3fc]" />
      <span className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-[#7dd3fc]" />
      <div className="bg-[#061425]/95 border border-[#7dd3fc]/70 px-5 py-3 min-w-[180px]">
        <Handle type="target" position={Position.Left} style={{ background: "#0a1929", width: 10, height: 10, border: "1.5px solid #7dd3fc" }} />
        <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-[#7dd3fc]/60 mb-1">
          <span>{data.spec ?? "REF-XXX"}</span>
          <span>◯</span>
        </div>
        <div className="text-[#e0f2fe] text-[15px] tracking-wide font-medium">{data.label}</div>
        <div className="mt-2 h-px bg-[#7dd3fc]/30" />
        <div className="text-[8px] tracking-[0.4em] uppercase text-[#7dd3fc]/50 mt-1">SCALE 1:1 · REV.A</div>
        <Handle type="source" position={Position.Right} style={{ background: "#0a1929", width: 10, height: 10, border: "1.5px solid #7dd3fc" }} />
      </div>
    </div>
  );
}

const nodeTypes = { spec: SpecNode };

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [text, setText] = useState("");

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge({ ...p, type: "step", style: { stroke: "#7dd3fc", strokeWidth: 1, strokeDasharray: "4 2" } }, s)), []);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), type: "spec", data: { label, spec: `REF-${String(p.length + 1).padStart(3, "0")}` }, position: { x: Math.random() * 400, y: Math.random() * 280 } }]);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to"); if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      if (s && t) setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t, type: "step", style: { stroke: "#7dd3fc", strokeWidth: 1, strokeDasharray: "4 2" } }]);
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      const ids = nodes.filter((n) => n.data.label === label).map((n) => n.id);
      setNodes((p) => p.filter((n) => !ids.includes(n.id)));
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to"); if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      setEdges((p) => p.filter((n) => n.source !== s || n.target !== t));
    }
    setText("");
  };

  return (
    <div className={`${sans.className} min-h-screen bg-[#0a1929] text-[#e0f2fe] relative overflow-hidden`}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#7dd3fc 1px, transparent 1px), linear-gradient(90deg, #7dd3fc 1px, transparent 1px), linear-gradient(#7dd3fc 1px, transparent 1px), linear-gradient(90deg, #7dd3fc 1px, transparent 1px)",
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        }} />

      <div className="relative z-10 grid grid-cols-[1fr_380px] min-h-screen">
        <div className="border-r border-[#7dd3fc]/30 flex flex-col">
          <header className="border-b border-[#7dd3fc]/30 px-8 py-5 flex items-center justify-between">
            <div className="flex items-baseline gap-6">
              <span className={`${mono.className} text-[10px] tracking-[0.4em] uppercase text-[#7dd3fc]/70`}>DWG №</span>
              <h1 className={`${mono.className} text-[22px] tracking-[0.15em] uppercase font-light`}>
                GRAPH<span className="text-[#7dd3fc]">/</span>SCHEMATIC<span className="text-[#7dd3fc]">/</span>2026
              </h1>
            </div>
            <div className={`${mono.className} text-[10px] tracking-[0.3em] uppercase text-[#7dd3fc]/60 text-right`}>
              <div>SHEET 01 OF 01</div>
              <div>PROJECT: TOPOLOGY-A</div>
            </div>
          </header>

          <div className="flex-1 relative">
            <div className={`${mono.className} absolute top-4 left-6 z-10 text-[10px] tracking-[0.3em] uppercase text-[#7dd3fc]/50`}>
              ⊕ ORIGIN 0,0
            </div>
            <div className={`${mono.className} absolute bottom-4 right-6 z-10 text-[10px] tracking-[0.3em] uppercase text-[#7dd3fc]/50 text-right`}>
              ⊕ TOLERANCE ±0.05<br/>UNIT: PX
            </div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              style={{ background: "transparent" }}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Lines} color="#7dd3fc15" gap={48} />
            </ReactFlow>
          </div>

          <footer className={`${mono.className} border-t border-[#7dd3fc]/30 px-8 py-3 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#7dd3fc]/60`}>
            <span>STATUS · APPROVED</span>
            <span>NODES {String(nodes.length).padStart(3, "0")} / EDGES {String(edges.length).padStart(3, "0")}</span>
            <span>2026-05-27</span>
          </footer>
        </div>

        <aside className="flex flex-col">
          <div className="border-b border-[#7dd3fc]/30 px-7 py-6">
            <div className={`${mono.className} text-[10px] tracking-[0.4em] uppercase text-[#7dd3fc]/60 mb-2`}>// title block</div>
            <h2 className={`${mono.className} text-[28px] leading-[1.05] tracking-[-0.01em] font-light`}>
              Directed<br/>graph editor.
            </h2>
            <p className="mt-3 text-[12px] leading-[1.6] text-[#e0f2fe]/60 max-w-[260px]">
              Issue commands in natural syntax. Each instruction is logged, dimensioned, and committed to the working drawing.
            </p>
          </div>

          <div className="border-b border-[#7dd3fc]/30 px-7 py-6">
            <div className={`${mono.className} text-[10px] tracking-[0.4em] uppercase text-[#7dd3fc]/60 mb-3`}>// instruction</div>
            <div className="border border-[#7dd3fc]/40 bg-[#061425] px-4 py-3 flex items-center gap-3">
              <span className={`${mono.className} text-[#7dd3fc] text-[12px]`}>CMD»</span>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && exec()}
                placeholder="add node Cache"
                className={`${mono.className} flex-1 bg-transparent outline-none text-[13px] text-[#e0f2fe] placeholder-[#7dd3fc]/30 tracking-wide`}
              />
            </div>
            <button onClick={exec}
              className={`${mono.className} mt-3 w-full text-[10px] tracking-[0.4em] uppercase py-2.5 border border-[#7dd3fc] text-[#7dd3fc] hover:bg-[#7dd3fc] hover:text-[#0a1929] transition-colors`}>
              ▸ COMMIT TO DRAWING
            </button>
          </div>

          <div className="border-b border-[#7dd3fc]/30 px-7 py-6">
            <div className={`${mono.className} text-[10px] tracking-[0.4em] uppercase text-[#7dd3fc]/60 mb-3`}>// legend</div>
            <table className={`${mono.className} text-[11px] w-full`}>
              <tbody className="[&>tr>td]:py-1.5 [&>tr>td]:tracking-wide [&>tr]:border-b [&>tr]:border-[#7dd3fc]/15">
                <tr><td className="text-[#7dd3fc]/70 w-8">A1</td><td className="text-[#e0f2fe]/80">add node</td><td className="text-[#7dd3fc]/50 text-right">⟨label⟩</td></tr>
                <tr><td className="text-[#7dd3fc]/70">A2</td><td className="text-[#e0f2fe]/80">remove node</td><td className="text-[#7dd3fc]/50 text-right">⟨label⟩</td></tr>
                <tr><td className="text-[#7dd3fc]/70">B1</td><td className="text-[#e0f2fe]/80">add edge</td><td className="text-[#7dd3fc]/50 text-right">⟨a⟩→⟨b⟩</td></tr>
                <tr><td className="text-[#7dd3fc]/70">B2</td><td className="text-[#e0f2fe]/80">remove edge</td><td className="text-[#7dd3fc]/50 text-right">⟨a⟩→⟨b⟩</td></tr>
              </tbody>
            </table>
          </div>

          <div className={`${mono.className} mt-auto px-7 py-5 text-[9px] tracking-[0.35em] uppercase text-[#7dd3fc]/50 leading-relaxed`}>
            DRAWN BY · CLAUDE<br/>
            CHECKED · ✓ AUTOMATIC<br/>
            MATERIAL · TYPESCRIPT / REACT
          </div>
        </aside>
      </div>
    </div>
  );
}
