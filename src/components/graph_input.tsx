"use client";

import { type Edge, type Node } from "@xyflow/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { executeCommand } from "~/lib/graph_commands";
import { Alert, AlertTitle } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function GraphInput({
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
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    message: string;
    run: () => void;
  } | null>(null);

  const submit = () => {
    const result = executeCommand(text, { nodes, setNodes, edges, setEdges, onLog });
    if (result.status === "noop") return;
    if (result.status === "ok") {
      setError(null);
      setText("");
      return;
    }
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    // Defer one tick so the Enter keyup completes on the input before Radix
    // auto-focuses the dialog action button — otherwise the same keypress
    // immediately activates the focused action and the dialog flashes shut.
    const pending = { message: result.message, run: result.run };
    setTimeout(() => setConfirm(pending), 0);
  };

  const handleConfirm = () => {
    confirm?.run();
    setConfirm(null);
    setText("");
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-hand text-[24px] leading-none text-[#d96456] select-none">
          ›
        </span>
        <Input
          variant="notebook"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="add node Cache"
        />
      </div>
      <Button variant="notebook" onClick={submit} className="mt-3">
        go on then →
      </Button>

      {error && (
        <Alert variant="notebook" className="mt-3">
          <AlertTitle>✗ {error}</AlertTitle>
        </Alert>
      )}

      <AlertDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
      >
        <AlertDialogContent variant="notebook">
          <AlertDialogHeader>
            <AlertDialogTitle>are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="notebook">never mind</AlertDialogCancel>
            <AlertDialogAction variant="notebook" onClick={handleConfirm}>
              yes, reset →
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
