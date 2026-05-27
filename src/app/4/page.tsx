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
import { Caveat, Instrument_Serif } from "next/font/google";
import { useCallback, useState } from "react";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const hand = Caveat({ subsets: ["latin"], weight: ["400", "500"] });

const PALETTE = ["#ff8c6b", "#7ba87b", "#e9a7d1", "#f4c869", "#8aa7d6"];

const INITIAL_NODES: Node[] = [
  { id: "node_1", position: { x: 0, y: 200 }, data: { label: "Internet", c: 0 }, type: "blob" },
  { id: "node_2", position: { x: 260, y: 200 }, data: { label: "Web Server", c: 1 }, type: "blob" },
  { id: "node_3", position: { x: 520, y: 200 }, data: { label: "Database", c: 2 }, type: "blob" },
];
const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "node_1", target: "node_2", style: { stroke: "#3a2a1f", strokeWidth: 2, strokeDasharray: "1 6", strokeLinecap: "round" } },
  { id: "e2", source: "node_2", target: "node_3", style: { stroke: "#3a2a1f", strokeWidth: 2, strokeDasharray: "1 6", strokeLinecap: "round" } },
];

function BlobNode({ data }: { data: { label: string; c: number } }) {
  const color = PALETTE[data.c % PALETTE.length]!;
  return (
    <div className="relative">
      <svg className="absolute -inset-4 -z-10" viewBox="0 0 200 100" preserveAspectRatio="none" style={{ width: "calc(100% + 32px)", height: "calc(100% + 32px)" }}>
        <path d="M20,50 Q10,15 60,12 Q120,5 165,18 Q198,28 192,55 Q188,85 140,90 Q70,98 35,82 Q5,72 20,50 Z" fill={color} opacity="0.9" />
      </svg>
      <div className={`${display.className} relative px-7 py-4 text-[22px] text-[#2a1c14] italic`} style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.4)" }}>
        <Handle type="target" position={Position.Left} style={{ background: "#2a1c14", width: 8, height: 8, border: "2px solid #fff5e6" }} />
        {data.label}
        <Handle type="source" position={Position.Right} style={{ background: "#2a1c14", width: 8, height: 8, border: "2px solid #fff5e6" }} />
      </div>
    </div>
  );
}

const nodeTypes = { blob: BlobNode };

const grain = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [text, setText] = useState("");

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge({ ...p, style: { stroke: "#3a2a1f", strokeWidth: 2, strokeDasharray: "1 6", strokeLinecap: "round" } }, s)), []);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), type: "blob", data: { label, c: p.length % PALETTE.length }, position: { x: Math.random() * 400, y: Math.random() * 280 } }]);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to"); if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      if (s && t) setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t, style: { stroke: "#3a2a1f", strokeWidth: 2, strokeDasharray: "1 6", strokeLinecap: "round" } }]);
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
    <div className="min-h-screen bg-[#fbeed7] text-[#2a1c14] relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: `url("${grain}")` }} />
      <div className="pointer-events-none fixed -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-50 mix-blend-multiply" style={{ background: "#ff8c6b" }} />
      <div className="pointer-events-none fixed -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-40 mix-blend-multiply" style={{ background: "#7ba87b" }} />
      <div className="pointer-events-none fixed top-1/3 right-10 w-[260px] h-[260px] rounded-full opacity-40 mix-blend-multiply" style={{ background: "#e9a7d1" }} />

      <header className="relative z-10 px-10 pt-10 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <div className={`${hand.className} text-[28px] text-[#c44830] -rotate-2 mb-2`}>~ a little garden of nodes ~</div>
            <h1 className={`${display.className} text-[80px] leading-[0.9] tracking-[-0.02em]`}>
              soft <em className="italic">structures</em>,
              <br />gently <em className="italic">connected</em>.
            </h1>
          </div>
          <div className={`${hand.className} text-[20px] leading-tight text-[#2a1c14]/70 rotate-3 text-right max-w-[200px]`}>
            issue n°4 — risograph<br/>printed with love &<br/>three colors of ink
          </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-[1fr_360px] gap-6 px-10 pb-10">
        <section className="relative">
          <div className="h-[68vh] rounded-[40px] border-2 border-[#2a1c14] overflow-hidden bg-[#fff5e0]/60 backdrop-blur-sm shadow-[8px_8px_0_0_#2a1c14]">
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
              <Background variant={BackgroundVariant.Cross} color="#2a1c1430" gap={36} size={4} />
            </ReactFlow>
          </div>
          <div className={`${hand.className} absolute -top-3 left-10 bg-[#fbeed7] px-3 text-[18px] -rotate-1`}>fig. 1 → the meadow</div>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="bg-[#fff5e0] border-2 border-[#2a1c14] rounded-[28px] p-6 shadow-[6px_6px_0_0_#2a1c14] relative">
            <div className={`${hand.className} absolute -top-4 left-6 bg-[#f4c869] border-2 border-[#2a1c14] rounded-full px-4 py-0.5 text-[18px] -rotate-2`}>type here ↓</div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && exec()}
              placeholder="add node Cache"
              className={`${display.className} w-full bg-transparent outline-none text-[28px] italic placeholder-[#2a1c14]/30 border-b-2 border-dashed border-[#2a1c14]/40 pb-2`}
            />
            <button onClick={exec} className={`${hand.className} mt-4 text-[22px] bg-[#ff8c6b] border-2 border-[#2a1c14] rounded-full px-5 py-1 shadow-[3px_3px_0_0_#2a1c14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#2a1c14] transition-all`}>
              plant it →
            </button>
          </div>

          <div className="bg-[#fff5e0] border-2 border-[#2a1c14] rounded-[28px] p-6 shadow-[6px_6px_0_0_#2a1c14]">
            <div className={`${display.className} text-[24px] italic mb-3`}>little grammar</div>
            <ul className={`${hand.className} text-[20px] leading-[1.6] text-[#2a1c14]/85`}>
              <li>• add node <span className="bg-[#e9a7d1] px-1.5 rounded">label</span></li>
              <li>• remove node <span className="bg-[#e9a7d1] px-1.5 rounded">label</span></li>
              <li>• add edge from <span className="bg-[#7ba87b]/70 px-1.5 rounded">a</span> to <span className="bg-[#7ba87b]/70 px-1.5 rounded">b</span></li>
              <li>• remove edge from <span className="bg-[#7ba87b]/70 px-1.5 rounded">a</span> to <span className="bg-[#7ba87b]/70 px-1.5 rounded">b</span></li>
            </ul>
          </div>

          <div className={`${hand.className} text-[18px] text-[#2a1c14]/60 text-center mt-2`}>
            ✿ made with three inks ✿
          </div>
        </aside>
      </div>
    </div>
  );
}
