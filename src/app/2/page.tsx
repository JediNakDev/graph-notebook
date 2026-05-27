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
import { Fraunces, Inter } from "next/font/google";
import { useCallback, useState } from "react";

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "600", "900"], style: ["normal", "italic"] });
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

const INITIAL_NODES: Node[] = [
  { id: "node_1", position: { x: 0, y: 200 }, data: { label: "Internet", num: "I" }, type: "card" },
  { id: "node_2", position: { x: 280, y: 200 }, data: { label: "Web Server", num: "II" }, type: "card" },
  { id: "node_3", position: { x: 560, y: 200 }, data: { label: "Database", num: "III" }, type: "card" },
];
const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "node_1", target: "node_2", style: { stroke: "#1a1612", strokeWidth: 1 } },
  { id: "e2", source: "node_2", target: "node_3", style: { stroke: "#1a1612", strokeWidth: 1 } },
];

function CardNode({ data }: { data: { label: string; num?: string } }) {
  return (
    <div className="group bg-[#fbf6ed] border border-[#1a1612] px-6 py-4 min-w-[180px] shadow-[6px_6px_0_0_#1a1612]">
      <Handle type="target" position={Position.Left} style={{ background: "#1a1612", width: 6, height: 6, border: 0 }} />
      <div className="text-[10px] tracking-[0.3em] uppercase text-[#1a1612]/50 mb-1">N° {data.num ?? "—"}</div>
      <div className={`${display.className} text-[20px] leading-tight text-[#1a1612] italic`}>{data.label}</div>
      <Handle type="source" position={Position.Right} style={{ background: "#1a1612", width: 6, height: 6, border: 0 }} />
    </div>
  );
}

const nodeTypes = { card: CardNode };

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [text, setText] = useState("");

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge({ ...p, style: { stroke: "#1a1612", strokeWidth: 1 } }, s)), []);

  const toRoman = (n: number) => ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][n] ?? String(n);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), type: "card", data: { label, num: toRoman(p.length) }, position: { x: Math.random() * 400, y: Math.random() * 280 } }]);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to"); if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      if (s && t) setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t, style: { stroke: "#1a1612", strokeWidth: 1 } }]);
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
    <div className={`${body.className} min-h-screen bg-[#f5efe2] text-[#1a1612] selection:bg-[#1a1612] selection:text-[#f5efe2]`}>
      <header className="px-10 pt-10 pb-6 border-b border-[#1a1612]/20 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.45em] text-[#1a1612]/60 mb-3">— Volume IV · Topology Quarterly —</div>
          <h1 className={`${display.className} text-[88px] leading-[0.85] tracking-[-0.04em] font-light`}>
            On the <em className="italic font-normal">arrangement</em>
            <br/>of <em className="italic font-normal">things.</em>
          </h1>
        </div>
        <div className="text-right text-[11px] uppercase tracking-[0.25em] text-[#1a1612]/60 leading-relaxed">
          <div>An interactive essay</div>
          <div>in directed graphs</div>
          <div className="mt-3 text-[#1a1612]/40">No. 02 — MMXXVI</div>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_360px] min-h-[calc(100vh-200px)]">
        <section className="relative border-r border-[#1a1612]/20">
          <div className="absolute top-6 left-8 z-10 text-[10px] uppercase tracking-[0.4em] text-[#1a1612]/40">
            Figure I — <span className="italic">a composition</span>
          </div>
          <div className="absolute bottom-6 right-8 z-10 text-[10px] uppercase tracking-[0.3em] text-[#1a1612]/40 text-right">
            Pinch to zoom. Drag to rearrange.<br/>
            <span className="italic normal-case tracking-normal text-[#1a1612]/60">Composition rewards patience.</span>
          </div>
          <div className="h-[calc(100vh-200px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              style={{ background: "#f5efe2" }}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} color="#1a161233" gap={28} size={1} />
            </ReactFlow>
          </div>
        </section>

        <aside className="p-10 flex flex-col gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#1a1612]/50 mb-2">§ I.</div>
            <h2 className={`${display.className} text-[28px] leading-[1.05] tracking-[-0.02em] italic`}>The instrument.</h2>
            <p className="mt-3 text-[14px] leading-[1.65] text-[#1a1612]/80">
              <span className={`${display.className} float-left text-[56px] leading-[0.85] mr-2 mt-1 font-light`}>S</span>
              peak in plain sentences. The graph listens, then rearranges itself accordingly. Each command is a small revision to the manuscript before you.
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#1a1612]/50 mb-3">§ II. Command</div>
            <div className="border-b border-[#1a1612] pb-2 flex items-baseline gap-3">
              <span className={`${display.className} italic text-[#1a1612]/40`}>›</span>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && exec()}
                placeholder="add node Cache"
                className={`${display.className} flex-1 bg-transparent outline-none italic text-[20px] placeholder-[#1a1612]/30`}
              />
            </div>
            <button onClick={exec} className="mt-4 text-[10px] uppercase tracking-[0.4em] border-b border-[#1a1612] pb-0.5 hover:tracking-[0.5em] transition-all">
              Submit ⟶
            </button>
          </div>

          <div className="mt-auto">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#1a1612]/50 mb-3">§ III. Grammar</div>
            <ul className={`${display.className} text-[16px] italic leading-[1.7] text-[#1a1612]/75 space-y-0.5`}>
              <li>add node <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨label⟩</span></li>
              <li>remove node <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨label⟩</span></li>
              <li>add edge from <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨a⟩</span> to <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨b⟩</span></li>
              <li>remove edge from <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨a⟩</span> to <span className="not-italic font-mono text-[12px] text-[#1a1612]/50">⟨b⟩</span></li>
            </ul>
          </div>

          <div className="text-[10px] uppercase tracking-[0.35em] text-[#1a1612]/40 border-t border-[#1a1612]/20 pt-4">
            Set in Fraunces & Inter.<br/>Printed in the browser.
          </div>
        </aside>
      </div>
    </div>
  );
}
