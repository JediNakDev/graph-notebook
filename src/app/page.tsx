import NodeDisplay from "../components/node_display";
import { INITIAL_NODES, INITIAL_EDGES } from "./constant";

export default function App() {
  return (
    <NodeDisplay initialNodes={INITIAL_NODES} initialEdges={INITIAL_EDGES} />
  );
}
