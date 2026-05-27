"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Caveat, Newsreader } from "next/font/google";
import { useCallback, useState } from "react";
import { INITIAL_NODES, INITIAL_EDGES } from "./constant";

const hand = Caveat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const serif = Newsreader({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"] });

const paperBg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES as unknown as Node[]);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES as unknown as Edge[]);
  const [text, setText] = useState("");
  const [jot, setJot] = useState<string[]>([
    "Internet → Web Server → Database",
    "remember to label everything ✦",
  ]);

  const onNodesChange = useCallback((c: any) => setNodes((s) => applyNodeChanges(c, s)), []);
  const onEdgesChange = useCallback((c: any) => setEdges((s) => applyEdgeChanges(c, s)), []);
  const onConnect = useCallback((p: any) => setEdges((s) => addEdge(p, s)), []);

  const note = (m: string) => setJot((h) => [...h.slice(-6), m]);

  const exec = () => {
    const list = text.split(/\s+/);
    const cmd = list[0]?.toLowerCase();
    if (cmd === "add" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      setNodes((p) => [...p, { id: crypto.randomUUID(), data: { label }, position: { x: Math.random() * 400, y: Math.random() * 280 } }]);
      note(`✎ added node "${label}"`);
    } else if (cmd === "add" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to");
      if (i < 0) return setText("");
      const sLabel = list.slice(3, i).join(" ");
      const tLabel = list.slice(i + 1).join(" ");
      const s = nodes.find((n: any) => n.data.label === sLabel)?.id;
      const t = nodes.find((n: any) => n.data.label === tLabel)?.id;
      if (s && t) {
        setEdges((p) => [...p, { id: crypto.randomUUID(), source: s, target: t }]);
        note(`✎ ${sLabel} → ${tLabel}`);
      }
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "node") {
      const label = list.slice(2).join(" ");
      const ids = nodes.filter((n: any) => n.data.label === label).map((n) => n.id);
      setNodes((p) => p.filter((n) => !ids.includes(n.id)));
      note(`✗ removed "${label}"`);
    } else if (cmd === "remove" && list[1]?.toLowerCase() === "edge" && list[2]?.toLowerCase() === "from") {
      const i = list.indexOf("to");
      if (i < 0) return setText("");
      const sLabel = list.slice(3, i).join(" ");
      const tLabel = list.slice(i + 1).join(" ");
      const s = nodes.find((n: any) => n.data.label === sLabel)?.id;
      const t = nodes.find((n: any) => n.data.label === tLabel)?.id;
      setEdges((p) => p.filter((n) => n.source !== s || n.target !== t));
      note(`✗ ${sLabel} ⇸ ${tLabel}`);
    }
    setText("");
  };

  return (
    <div
      className={`${serif.className} min-h-screen text-[#2a241c] relative overflow-hidden`}
      style={{ background: "#fbf6e9" }}
    >
      {/* paper grain */}
      <div className="pointer-events-none fixed inset-0 opacity-70 mix-blend-multiply" style={{ backgroundImage: `url("${paperBg}")` }} />
      {/* horizontal ruling */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 31px, #6f8db8 31px 32px)",
        }}
      />
      {/* red margin */}
      <div className="pointer-events-none fixed top-0 bottom-0 left-[88px] w-px bg-[#d96456]/70" />
      <div className="pointer-events-none fixed top-0 bottom-0 left-[92px] w-px bg-[#d96456]/30" />
      {/* punched holes */}
      <div className="pointer-events-none fixed left-[32px] top-[12%] w-5 h-5 rounded-full bg-[#e8e0cf] shadow-inner border border-[#cdbf9b]" />
      <div className="pointer-events-none fixed left-[32px] top-[50%] w-5 h-5 rounded-full bg-[#e8e0cf] shadow-inner border border-[#cdbf9b]" />
      <div className="pointer-events-none fixed left-[32px] top-[88%] w-5 h-5 rounded-full bg-[#e8e0cf] shadow-inner border border-[#cdbf9b]" />

      <div className="relative z-10 pl-[120px] pr-10 pt-10 pb-12">
        {/* header */}
        <header className="flex items-end justify-between mb-8">
          <div>
            <div className={`${hand.className} text-[26px] text-[#d96456] -rotate-1 mb-1`}>
              ~ tuesday afternoon, in the library ~
            </div>
            <h1 className="text-[64px] leading-[0.95] tracking-[-0.02em] font-light">
              graph <em className="italic font-normal">notebook</em>
              <span className={`${hand.className} text-[42px] text-[#6f8db8] ml-3 -rotate-2 inline-block`}>(draft)</span>
            </h1>
            <p className={`${hand.className} text-[22px] text-[#2a241c]/70 mt-2`}>
              think out loud. draw boxes. connect them with little arrows.
            </p>
          </div>
          <div className={`${hand.className} text-right text-[20px] leading-tight text-[#2a241c]/60 rotate-2`}>
            <div>page 1 / ∞</div>
            <div className="text-[#d96456]">no. 0001</div>
          </div>
        </header>

        <div className="grid grid-cols-[1fr_340px] gap-8">
          {/* taped canvas */}
          <section className="relative">
            {/* tape pieces */}
            <div className="absolute -top-3 left-12 w-24 h-7 bg-[#f6e3a1]/75 rotate-[-4deg] shadow-sm z-20"
              style={{ clipPath: "polygon(2% 12%, 98% 4%, 99% 92%, 1% 88%)" }} />
            <div className="absolute -top-3 right-16 w-28 h-7 bg-[#f6e3a1]/75 rotate-[5deg] shadow-sm z-20"
              style={{ clipPath: "polygon(2% 6%, 98% 14%, 99% 92%, 1% 88%)" }} />
            <div className="absolute -bottom-3 left-[40%] w-24 h-7 bg-[#f6e3a1]/75 rotate-[2deg] shadow-sm z-20"
              style={{ clipPath: "polygon(2% 12%, 98% 4%, 99% 92%, 1% 88%)" }} />

            <div className="h-[70vh] bg-white border border-[#2a241c]/20 shadow-[0_18px_40px_-20px_rgba(42,36,28,0.35)] rounded-sm overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                proOptions={{ hideAttribution: true }}
              >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
              </ReactFlow>
            </div>

            <div className={`${hand.className} mt-3 text-[20px] text-[#2a241c]/60 italic flex justify-between`}>
              <span>↑ fig. 1 — the system, more or less</span>
              <span className="text-[#6f8db8]">drag the nodes around ↺</span>
            </div>
          </section>

          {/* margin notes */}
          <aside className="flex flex-col gap-6">
            {/* command input — looks like a note slip */}
            <div className="relative bg-[#fffbf0] border border-[#2a241c]/20 p-5 shadow-[4px_5px_0_-1px_rgba(42,36,28,0.12)] rotate-[0.6deg]">
              <div className={`${hand.className} absolute -top-3 left-4 bg-[#d96456] text-[#fffbf0] px-2 py-0.5 text-[16px] -rotate-2 rounded-sm`}>
                tell the graph what to do →
              </div>
              <div className="flex items-baseline gap-2 border-b border-dashed border-[#2a241c]/30 pb-1 mt-2">
                <span className={`${hand.className} text-[24px] text-[#d96456]`}>›</span>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && exec()}
                  placeholder="add node Cache"
                  className={`${hand.className} flex-1 bg-transparent outline-none text-[24px] placeholder-[#2a241c]/30`}
                />
              </div>
              <button
                onClick={exec}
                className={`${hand.className} mt-3 text-[20px] text-[#6f8db8] underline decoration-wavy decoration-[#6f8db8]/60 underline-offset-4 hover:text-[#d96456] hover:decoration-[#d96456]/60 transition-colors`}
              >
                go on then →
              </button>
            </div>

            {/* grammar — index card */}
            <div className="bg-[#fffbf0] border border-[#2a241c]/25 p-5 shadow-[3px_4px_0_-1px_rgba(42,36,28,0.12)] -rotate-[0.8deg]">
              <div className="border-b border-[#d96456]/50 pb-1 mb-3">
                <div className={`${hand.className} text-[24px] text-[#2a241c]`}>cheat sheet</div>
              </div>
              <ul className={`${hand.className} text-[20px] leading-[1.55] text-[#2a241c]/85 space-y-0.5`}>
                <li><span className="text-[#d96456]">+</span> add node <span className="italic text-[#6f8db8]">label</span></li>
                <li><span className="text-[#d96456]">−</span> remove node <span className="italic text-[#6f8db8]">label</span></li>
                <li><span className="text-[#d96456]">+</span> add edge from <span className="italic text-[#6f8db8]">a</span> to <span className="italic text-[#6f8db8]">b</span></li>
                <li><span className="text-[#d96456]">−</span> remove edge from <span className="italic text-[#6f8db8]">a</span> to <span className="italic text-[#6f8db8]">b</span></li>
              </ul>
              <div className={`${hand.className} mt-3 text-[18px] text-[#2a241c]/55 italic border-t border-dashed border-[#2a241c]/20 pt-2`}>
                p.s. labels can have spaces.
              </div>
            </div>

            {/* jotted log */}
            <div className="bg-[#fffbf0] border border-[#2a241c]/20 p-5 shadow-[4px_5px_0_-1px_rgba(42,36,28,0.12)] rotate-[0.4deg] flex-1">
              <div className={`${hand.className} text-[22px] text-[#2a241c] border-b border-dotted border-[#2a241c]/30 pb-1 mb-3`}>
                scribbles
              </div>
              <ul className={`${hand.className} text-[19px] leading-[1.5] text-[#2a241c]/80 space-y-1`}>
                {jot.map((j, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#6f8db8]">·</span>
                    <span>{j}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${hand.className} text-[18px] text-[#2a241c]/45 text-center italic`}>
              — kept loose in a leather folio —
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
