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
import { Orbitron, Space_Mono } from "next/font/google";
import { useCallback, useState } from "react";

const display = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

const INITIAL_NODES: Node[] = [
  { id: "node_1", position: { x: 0, y: 220 }, data: { label: "Internet" }, type: "neon" },
  { id: "node_2", position: { x: 260, y: 220 }, data: { label: "Web Server" }, type: "neon" },
  { id: "node_3", position: { x: 520, y: 220 }, data: { label: "Database" }, type: "neon" },
];
const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "node_1", target: "node_2", animated: true, style: { stroke: "#ff2bd6", strokeWidth: 2, filter: "drop-shadow(0 0 6px #ff2bd6)" } },
  { id: "e2", source: "node_2", target: "node_3", animated: true, style: { stroke: "#00f0ff", strokeWidth: 2, filter: "drop-shadow(0 0 6px #00f0ff)" } },
];

function NeonNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${display.className} relative px-6 py-3 bg-[#0a001a]/80 backdrop-blur-sm border border-[#ff2bd6] text-[#00f0ff] uppercase tracking-[0.25em] text-[13px] font-bold rounded-sm`}
      style={{ boxShadow: "0 0 0 1px #ff2bd644, 0 0 24px -2px #ff2bd6cc, inset 0 0 18px -8px #00f0ff" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#00f0ff", width: 10, height: 10, border: "1px solid #ff2bd6", boxShadow: "0 0 8px #00f0ff" }} />
      <span style={{ textShadow: "0 0 8px #00f0ff, 0 0 18px #00f0ff66" }}>{data.label}</span>
      <Handle type="source" position={Position.Right} style={{ background: "#ff2bd6", width: 10, height: 10, border: "1px solid #00f0ff", boxShadow: "0 0 8px #ff2bd6" }} />
    </div>
  );
}

const nodeTypes = { neon: NeonNode };

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [text, setText] = useState("");

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge({ ...p, animated: true, style: { stroke: "#ff2bd6", strokeWidth: 2, filter: "drop-shadow(0 0 6px #ff2bd6)" } }, s)), []);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), type: "neon", data: { label }, position: { x: Math.random() * 400, y: Math.random() * 280 } }]);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to"); if (i < 0) return setText("");
      const s = nodes.find((n) => n.data.label === list.slice(3, i).join(" "))?.id;
      const t = nodes.find((n) => n.data.label === list.slice(i + 1).join(" "))?.id;
      if (s && t) setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t, animated: true, style: { stroke: "#00f0ff", strokeWidth: 2, filter: "drop-shadow(0 0 6px #00f0ff)" } }]);
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
    <div className={`${mono.className} min-h-screen relative overflow-hidden text-[#e0d4ff]`}
      style={{
        background: "radial-gradient(ellipse at 20% 0%, #4a0080 0%, #1a0033 35%, #06000f 70%, #000 100%)",
      }}>
      <div className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(transparent 95%, #ff2bd6 95%), linear-gradient(90deg, transparent 95%, #00f0ff 95%)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        }} />
      <div className="pointer-events-none fixed inset-0 opacity-40"
        style={{ background: "radial-gradient(circle at 80% 90%, #ff2bd644 0%, transparent 50%)" }} />

      <header className={`${display.className} relative z-10 px-8 py-6 flex items-center justify-between border-b border-[#ff2bd6]/30`}>
        <div>
          <div className="text-[10px] tracking-[0.5em] text-[#00f0ff]/80 mb-1">▼ NEO-TOKYO NETWORK INTERFACE ▼</div>
          <h1 className="text-[36px] font-black tracking-[0.18em] uppercase"
            style={{ background: "linear-gradient(180deg, #fff 0%, #ff2bd6 60%, #00f0ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 20px #ff2bd6aa)" }}>
            GRAPH//2089
          </h1>
        </div>
        <div className="text-right text-[10px] tracking-[0.3em] uppercase">
          <div className="text-[#00f0ff]" style={{ textShadow: "0 0 8px #00f0ff" }}>● link: stable</div>
          <div className="text-[#ff2bd6] mt-1" style={{ textShadow: "0 0 8px #ff2bd6" }}>NODES.{nodes.length} / EDGES.{edges.length}</div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-[1fr_340px]">
        <div className="h-[calc(100vh-105px)] relative">
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
            <Background variant={BackgroundVariant.Dots} color="#ff2bd644" gap={32} size={1.5} />
          </ReactFlow>
        </div>

        <aside className="h-[calc(100vh-105px)] border-l border-[#ff2bd6]/30 bg-[#0a001a]/40 backdrop-blur-md p-6 flex flex-col gap-6">
          <div>
            <div className={`${display.className} text-[10px] tracking-[0.4em] text-[#00f0ff] mb-3`}
              style={{ textShadow: "0 0 8px #00f0ff" }}>◢ COMMAND CONSOLE</div>
            <div className="border border-[#ff2bd6]/60 bg-black/50 p-3 rounded-sm"
              style={{ boxShadow: "0 0 24px -6px #ff2bd6, inset 0 0 24px -12px #00f0ff" }}>
              <div className="flex items-center gap-2">
                <span className="text-[#00f0ff] text-sm" style={{ textShadow: "0 0 6px #00f0ff" }}>&gt;_</span>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && exec()}
                  placeholder="add node Cache"
                  className="flex-1 bg-transparent outline-none text-[#fff] placeholder-[#e0d4ff]/40 text-[14px] tracking-wide"
                />
              </div>
            </div>
            <button onClick={exec}
              className={`${display.className} mt-4 w-full text-[11px] tracking-[0.4em] uppercase py-2.5 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#0a001a] transition-all`}
              style={{ boxShadow: "0 0 16px -2px #00f0ffaa", textShadow: "0 0 8px #00f0ff" }}>
              ▶ EXECUTE
            </button>
          </div>

          <div>
            <div className={`${display.className} text-[10px] tracking-[0.4em] text-[#ff2bd6] mb-3`}
              style={{ textShadow: "0 0 8px #ff2bd6" }}>◢ SYNTAX MATRIX</div>
            <ul className="text-[12px] leading-[2] text-[#e0d4ff]/80">
              <li><span className="text-[#00f0ff]">add</span> node <span className="text-[#ff2bd6]">⟨label⟩</span></li>
              <li><span className="text-[#00f0ff]">remove</span> node <span className="text-[#ff2bd6]">⟨label⟩</span></li>
              <li><span className="text-[#00f0ff]">add</span> edge from <span className="text-[#ff2bd6]">⟨a⟩</span> to <span className="text-[#ff2bd6]">⟨b⟩</span></li>
              <li><span className="text-[#00f0ff]">remove</span> edge from <span className="text-[#ff2bd6]">⟨a⟩</span> to <span className="text-[#ff2bd6]">⟨b⟩</span></li>
            </ul>
          </div>

          <div className="mt-auto text-[10px] tracking-[0.3em] uppercase text-[#e0d4ff]/40 border-t border-[#ff2bd6]/20 pt-4">
            <div>// runtime · webgl off</div>
            <div>// shader · neon.v3</div>
            <div>// © shibuya systems</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
