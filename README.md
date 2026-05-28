# Graph Notebook

## Running locally

Requires Node 20+. Works with npm, pnpm, yarn, or bun.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run check` — lint + typecheck
- `npm run format:write` — Prettier

## Supported commands

The input accepts one command per submission. Keywords are case-insensitive; labels are case-sensitive and may contain spaces.

| Command                       | Effect                                                         |
| ----------------------------- | -------------------------------------------------------------- |
| `add node <label>`            | Append a node with the given label at a random position.       |
| `remove node <label>`         | Remove every node matching the label, plus any incident edges. |
| `add edge from <a> to <b>`    | Add a directed edge from node `a` to node `b`.                 |
| `remove edge from <a> to <b>` | Remove the matching directed edge.                             |
| `reset`                       | Restore the initial graph (prompts for confirmation).          |

Examples:

```
add node Cache
add node Database
add edge from Cache to Database
remove edge from Cache to Database
remove node Cache
reset
```

Expected behavior:

- A valid command clears the input and logs a line in the "scribbles" panel.
- An invalid command leaves the input intact and surfaces an inline error (e.g. `no node named "Cache"`, `use: add edge from <a> to <b>`).
- `reset` opens a confirmation dialog; cancelling is a no-op.
- The graph is persisted to `localStorage` after every successful mutation and restored on reload.
- Nodes can also be dragged on the canvas; positions are persisted.

## Design decisions and assumptions

- **Stack.** Next.js App Router + React 19, Tailwind v4, shadcn/Radix primitives, React flow for the canvas, Zod for validating persisted state.
- **Label as identity.** Commands address nodes by label rather than id. Duplicate labels are allowed at the data layer, but `remove node <label>` deletes all matches — labels are assumed unique in practice. Internal ids are UUIDs so the React Flow renderer stays stable across edits.
- **Persistence.** State is saved to `localStorage` after every mutation and validated with Zod on load (`src/lib/graph_storage.ts`). Invalid or absent storage falls back silently to the initial graph.
- **State shape.** `nodes` and `edges` live in the page component and are passed down. No global store — the app is small enough that prop-drilling is clearer than introducing context or a reducer.
- **Destructive actions.** Only `reset` requires confirmation. Removing a node implicitly removes its incident edges without a prompt; this is treated as expected.
- **Trace panel.** Currently shows a hard coded sample trace from `constants.ts` and highlights the active node on the canvas. The intent is that a future algorithm runner will produce real `TraceStep[]` values consumed by the same panel.

## Possible future implementation

- Allow more flexible input or integrate LLM
- Migrate state manager to zustand
- Allow customization on simulation trace
- Implement actual authentication and database.ß
- Allow multiple graphs per client or user
- PNG/SVG export
