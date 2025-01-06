import React, { useRef } from "react";
import useWorkflowStore from "../../../store/store";
import { toast } from "react-toastify";

const WorkflowActions = () => {
    const fileInputRef = useRef(null);
    const { nodes, edges, saveWorkflow } = useWorkflowStore();

    const handleExport = () => {
        const workflow = { nodes, edges };
        const jsonString = JSON.stringify(workflow, null, 2);

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "workflow.json";
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Workflow exported successfully!");
    };

    const handleImport = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);

                    if (!Array.isArray(importedData.nodes) || !Array.isArray(importedData.edges)) {
                        throw new Error("Invalid workflow format");
                    }

                    saveWorkflow(importedData.nodes, importedData.edges);
                    toast.success("Workflow imported successfully!");
                } catch (error) {
                    toast.error("Failed to import workflow. Invalid JSON format.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button
                style={{
                    padding: "10px 20px",
                    margin: "0 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={handleExport}
            >
                Export Workflow
            </button>

            <button
                style={{
                    padding: "10px 20px",
                    margin: "0 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={() => fileInputRef.current.click()}
            >
                Import Workflow
            </button>

            <input
                type="file"
                ref={fileInputRef}
                accept="application/json"
                style={{ display: "none" }}
                onChange={handleImport}
            />
        </div>
    );
};

export default WorkflowActions;