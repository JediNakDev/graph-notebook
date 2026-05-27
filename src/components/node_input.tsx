"use client";

import { type Edge, type Node } from "@xyflow/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { executeCommand } from "~/lib/graph_commands";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NodeInput({
  nodes,
  setNodes,
  edges,
  setEdges,
  onLog,
}: {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onLog?: (message: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    executeCommand(text, { nodes, setNodes, edges, setEdges, onLog });
    setText("");
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-[family-name:var(--font-caveat)] text-[24px] text-[#d96456] leading-none select-none">
          ›
        </span>
        <Input
          variant="notebook"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="add node Cache"
        />
      </div>
      <Button variant="notebook" onClick={submit} className="mt-3">
        go on then →
      </Button>
    </div>
  );
}
