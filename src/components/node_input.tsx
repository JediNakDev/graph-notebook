import { type Edge, type Node } from "@xyflow/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

export default function NodeInput({
  nodes,
  setNodes,
  edges,
  setEdges,
}: {
  nodes: Node[];
  setNodes;
  edges: Edge[];
  setEdges;
}) {
  const [text, setText] = useState("");

  const handleText = () => {
    const list = text.split(/\s+/);

    if (list[0]?.toLowerCase() == "add") {
      if (list[1]?.toLowerCase() == "node") {
        const id = crypto.randomUUID();
        const label = list.slice(2).join(" ");
        setNodes((prev: Node[]) => {
          const newNode: Node = {
            id,
            data: { label },
            position: {
              x: Math.random() * 250,
              y: Math.random() * 250,
            },
          };
          return [...prev, newNode];
        });
      }
      if (
        list[1]?.toLowerCase() == "edge" &&
        list[2]?.toLowerCase() == "from"
      ) {
        const id = crypto.randomUUID();
        const index = list.indexOf("to");
        if (index == -1) {
          setText("");
          return;
        }
        const sourceLabel = list.slice(3, index).join(" ");
        const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
        if (!source) {
          setText("");
          return;
        }
        const targetLabel = list.slice(index + 1).join(" ");
        const target = nodes.find((n) => n.data.label === targetLabel)?.id;
        if (!target) {
          setText("");
          return;
        }
        setEdges((prev: Edge[]) => {
          const newEdge: Edge = {
            id,
            source,
            target,
          };
          return [...prev, newEdge];
        });
      }
    }
    if (list[0]?.toLowerCase() == "remove") {
      if (list[1]?.toLowerCase() == "node") {
        const label = list.slice(2).join(" ");
        const nodeIds = nodes
          .filter((n) => n.data.label === label)
          .map((n) => n.id);
        const relatedEdges = edges.find;
        setNodes((prev: Node[]) => {
          return prev.filter((n) => !nodeIds.includes(n.id));
        });
      }
      if (
        list[1]?.toLowerCase() == "edge" &&
        list[2]?.toLowerCase() == "from"
      ) {
        const index = list.indexOf("to");
        if (index == -1) {
          setText("");
          return;
        }
        const sourceLabel = list.slice(3, index).join(" ");
        const source = nodes.find((n) => n.data.label === sourceLabel)?.id;
        const targetLabel = list.slice(index + 1).join(" ");
        const target = nodes.find((n) => n.data.label === targetLabel)?.id;
        setEdges((prev: Edge[]) => {
          return prev.filter((n) => n.source != source || n.target != target);
        });
      }
    }
    setText("");
  };
  return (
    <Field orientation="horizontal">
      <Input
        type="text"
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleText()}
      />
      <Button onClick={handleText}>Submit</Button>
    </Field>
  );
}
