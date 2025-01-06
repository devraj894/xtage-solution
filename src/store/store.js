import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const workflowStore = (set, get) => ({
  nodes: [], 
  edges: [],
  hasWorkflowSaved: false,

  // Save nodes and edges to the store (and persist them)
  saveWorkflow: (nodes, edges) => {
    set({
      nodes, 
      edges, 
      hasWorkflowSaved: true,
    });
  },
});

const useWorkflowStore = create(
  devtools(
    persist(workflowStore, {
      name: "workflow-storage", 
    })
  )
);

export default useWorkflowStore;
