"use client";

import { type Node } from "@xyflow/react";
import { type Dispatch, type SetStateAction } from "react";
import { type TraceStep } from "~/lib/constants";
import { Button } from "./ui/button";

export default function TracePanel({
  trace,
  stepIndex,
  setStepIndex,
  nodes,
}: {
  trace: TraceStep[];
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
  nodes: Node[];
}) {
  const current = trace[stepIndex];
  const nodeExists =
    current != null && nodes.some((n) => n.id === current.nodeId);

  return (
    <div className="-rotate-[0.3deg] border border-[#2a241c]/25 bg-[#fffbf0] p-5 shadow-[3px_4px_0_-1px_rgba(42,36,28,0.12)]">
      <div className="mb-3 border-b border-[#6f8db8]/50 pb-1">
        <div className="font-hand text-[24px] text-[#2a241c]">
          trace · walk-through
        </div>
      </div>

      {trace.length === 0 ? (
        <div className="font-hand text-[20px] text-[#2a241c]/60 italic">
          no trace loaded.
        </div>
      ) : (
        <>
          <div className="font-hand text-[20px] text-[#2a241c]/85">
            step{" "}
            <span className="text-[#d96456]">
              {stepIndex + 1}/{trace.length}
            </span>{" "}
            — {current?.description}
          </div>
          {!nodeExists && (
            <div className="font-hand mt-1 text-[18px] text-[#d96456] italic">
              (node was removed)
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <Button
              variant="notebook"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              ← prev
            </Button>
            <Button
              variant="notebook"
              onClick={() =>
                setStepIndex((i) => Math.min(trace.length - 1, i + 1))
              }
              disabled={stepIndex >= trace.length - 1}
            >
              next →
            </Button>
          </div>
        </>
      )}

    </div>
  );
}
