"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import GraphDisplay from "~/components/graph_display";
import GraphInput from "~/components/graph_input";
import TracePanel from "~/components/trace_panel";
import {
  INITIAL_EDGES,
  INITIAL_NODES,
  INITIAL_JOT,
  PAPER_BG,
  SAMPLE_TRACE,
  type TraceStep,
} from "~/lib/constants";
import { loadGraph } from "~/lib/graph_storage";

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [jot, setJot] = useState<string[]>(INITIAL_JOT);
  const [trace] = useState<TraceStep[]>(SAMPLE_TRACE);
  const [stepIndex, setStepIndex] = useState(0);
  const activeNodeId = trace[stepIndex]?.nodeId ?? null;

  useEffect(() => {
    const saved = loadGraph();
    if (saved) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
      setJot((h) => [...h, "✦ restored from last session"]);
    }
  }, []);

  const onNodesChange = useCallback(
    (changes: Parameters<typeof applyNodeChanges<Node>>[0]) =>
      setNodes((s) => applyNodeChanges(changes, s)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: Parameters<typeof applyEdgeChanges<Edge>>[0]) =>
      setEdges((s) => applyEdgeChanges(changes, s)),
    [],
  );
  const onConnect = useCallback(
    (params: Parameters<typeof addEdge<Edge>>[0]) =>
      setEdges((s) => addEdge(params, s)),
    [],
  );

  const log = (m: string) => setJot((h) => [...h.slice(-6), m]);

  return (
    <div
      className={`font-display relative min-h-screen overflow-hidden text-[#2a241c]`}
      style={{ background: "#fbf6e9" }}
    >
      {/* paper grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-70 mix-blend-multiply"
        style={{ backgroundImage: `url("${PAPER_BG}")` }}
      />
      {/* horizontal ruling */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 31px, #6f8db8 31px 32px)",
        }}
      />
      {/* red margin */}
      <div className="pointer-events-none fixed top-0 bottom-0 left-[88px] w-px bg-[#d96456]/70" />
      <div className="pointer-events-none fixed top-0 bottom-0 left-[92px] w-px bg-[#d96456]/30" />
      {/* punched holes */}
      <div className="pointer-events-none fixed top-[12%] left-[32px] h-5 w-5 rounded-full border border-[#cdbf9b] bg-[#e8e0cf] shadow-inner" />
      <div className="pointer-events-none fixed top-[50%] left-[32px] h-5 w-5 rounded-full border border-[#cdbf9b] bg-[#e8e0cf] shadow-inner" />
      <div className="pointer-events-none fixed top-[88%] left-[32px] h-5 w-5 rounded-full border border-[#cdbf9b] bg-[#e8e0cf] shadow-inner" />

      <div className="relative z-10 pt-10 pr-10 pb-12 pl-[120px]">
        <div className="grid grid-cols-[1fr_340px] items-start gap-8">
          <div>
            <header className="mb-8 flex items-end justify-between gap-8">
              <div>
                <div
                  className={`font-hand mb-1 -rotate-1 text-[26px] text-[#d96456]`}
                >
                  ~ tuesday afternoon, in the library ~
                </div>
                <h1 className="text-[64px] leading-[0.95] font-light tracking-[-0.02em]">
                  graph <em className="font-normal italic">notebook</em>
                  <span
                    className={`font-hand ml-3 inline-block -rotate-2 text-[42px] text-[#6f8db8]`}
                  >
                    (draft)
                  </span>
                </h1>
                <p className={`font-hand mt-2 text-[22px] text-[#2a241c]/70`}>
                  think out loud. draw boxes. connect them with little arrows.
                </p>
              </div>
              <div className="w-[340px] shrink-0">
                <TracePanel
                  trace={trace}
                  stepIndex={stepIndex}
                  setStepIndex={setStepIndex}
                  nodes={nodes}
                />
              </div>
            </header>

            {/* taped canvas */}
            <section className="relative">
            <div
              className="absolute -top-3 left-12 z-20 h-7 w-24 rotate-[-4deg] bg-[#f6e3a1]/75 shadow-sm"
              style={{ clipPath: "polygon(2% 12%, 98% 4%, 99% 92%, 1% 88%)" }}
            />
            <div
              className="absolute -top-3 right-16 z-20 h-7 w-28 rotate-[5deg] bg-[#f6e3a1]/75 shadow-sm"
              style={{ clipPath: "polygon(2% 6%, 98% 14%, 99% 92%, 1% 88%)" }}
            />
            <div
              className="absolute -bottom-3 left-[40%] z-20 h-7 w-24 rotate-[2deg] bg-[#f6e3a1]/75 shadow-sm"
              style={{ clipPath: "polygon(2% 12%, 98% 4%, 99% 92%, 1% 88%)" }}
            />

            <div className="h-[70vh] overflow-hidden rounded-sm border border-[#2a241c]/20 bg-white shadow-[0_18px_40px_-20px_rgba(42,36,28,0.35)]">
              <GraphDisplay
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                activeNodeId={activeNodeId}
              />
            </div>

            <div
              className={`font-hand mt-3 flex justify-between text-[20px] text-[#2a241c]/60 italic`}
            >
              <span>↑ fig. 1 — the system, more or less</span>
              <span className="text-[#6f8db8]">drag the nodes around ↺</span>
            </div>
            </section>
          </div>

          {/* margin notes */}
          <aside className="flex flex-col gap-6">
            {/* command input (default styled GraphInput, wrapped in a note slip) */}
            <div className="relative border border-[#2a241c]/20 bg-[#fffbf0] p-5 shadow-[4px_5px_0_-1px_rgba(42,36,28,0.12)]">
              <div
                className={`font-hand absolute -top-3 left-4 -rotate-2 rounded-sm bg-[#d96456] px-2 py-0.5 text-[16px] text-[#fffbf0]`}
              >
                tell the graph what to do →
              </div>
              <div className="mt-2">
                <GraphInput
                  nodes={nodes}
                  setNodes={setNodes}
                  edges={edges}
                  setEdges={setEdges}
                  onLog={log}
                />
              </div>
            </div>

            {/* grammar — index card */}
            <div className="-rotate-[0.8deg] border border-[#2a241c]/25 bg-[#fffbf0] p-5 shadow-[3px_4px_0_-1px_rgba(42,36,28,0.12)]">
              <div className="mb-3 border-b border-[#d96456]/50 pb-1">
                <div className={`font-hand text-[24px] text-[#2a241c]`}>
                  cheat sheet
                </div>
              </div>
              <ul
                className={`font-hand space-y-0.5 text-[20px] leading-[1.55] text-[#2a241c]/85`}
              >
                <li>
                  <span className="text-[#d96456]">+</span> add node{" "}
                  <span className="text-[#6f8db8] italic">label</span>
                </li>
                <li>
                  <span className="text-[#d96456]">−</span> remove node{" "}
                  <span className="text-[#6f8db8] italic">label</span>
                </li>
                <li>
                  <span className="text-[#d96456]">+</span> add edge from{" "}
                  <span className="text-[#6f8db8] italic">a</span> to{" "}
                  <span className="text-[#6f8db8] italic">b</span>
                </li>
                <li>
                  <span className="text-[#d96456]">−</span> remove edge from{" "}
                  <span className="text-[#6f8db8] italic">a</span> to{" "}
                  <span className="text-[#6f8db8] italic">b</span>
                </li>
                <li>
                  <span className="text-[#d96456]">↺</span> reset
                </li>
              </ul>
              <div
                className={`font-hand mt-3 border-t border-dashed border-[#2a241c]/20 pt-2 text-[18px] text-[#2a241c]/55 italic`}
              >
                p.s. labels can have spaces.
              </div>
            </div>

            {/* jotted log */}
            <div className="flex-1 rotate-[0.4deg] border border-[#2a241c]/20 bg-[#fffbf0] p-5 shadow-[4px_5px_0_-1px_rgba(42,36,28,0.12)]">
              <div
                className={`font-hand mb-3 border-b border-dotted border-[#2a241c]/30 pb-1 text-[22px] text-[#2a241c]`}
              >
                scribbles
              </div>
              <ul
                className={`font-hand space-y-1 text-[19px] leading-[1.5] text-[#2a241c]/80`}
              >
                {jot.map((j, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#6f8db8]">·</span>
                    <span>{j}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`font-hand text-center text-[18px] text-[#2a241c]/45 italic`}
            >
              — kept loose in a leather folio —
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
