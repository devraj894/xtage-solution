import React, { useState, useEffect } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NodePropertiesSidebar from "./SideBar/NodePropertiesSidebar";
import useWorkflowStore from "../../store/store";
import { v4 as uuid } from "uuid"; 
import WorkflowActions from "./WorkflowActions/WorkflowActions";
import SimulateExecution from "./SimulateExecution/SimulateExection";
import "./styles.css";

const nodePalette = [
    { type: "input", label: "Start", style: { backgroundColor: "green", color: "#fff" } },
    { type: "default", label: "Task", style: { backgroundColor: "blue", color: "#fff" } },
    { type: "default", label: "Decision", style: { backgroundColor: "orange", color: "#fff" } },
    { type: "output", label: "End", style: { backgroundColor: "red", color: "#fff" } },
];

const Canvas = () => {
    const GRID_SIZE = 20; 
    const { nodes: persistedNodes, edges: persistedEdges, saveWorkflow } = useWorkflowStore();

    const initialNodes = persistedNodes.length > 0
        ? persistedNodes
        : [
            { id: "1", type: "input", position: { x: 10, y: 10 }, data: { label: "Start", status: "success", executionTime: 5 } },
            { id: "2", type: "process", position: { x: 200, y: 50 }, data: { label: "Task", status: "failed", executionTime: 10 } },
            { id: "3", type: "decision", position: { x: 400, y: 100 }, data: { label: "Decision", status: "success", executionTime: 8 } },
            { id: "4", type: "output", position: { x: 600, y: 150 }, data: { label: "End", status: "success", executionTime: 2 } },
        ];

    const initialEdges = persistedEdges.length > 0 ? persistedEdges : [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null); 
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [executionStep, setExecutionStep] = useState(0);

    const startSimulation = () => {
        setSimulationRunning(true);
        let step = 0;
        const intervalId = setInterval(() => {
            if (step >= nodes.length) {
                clearInterval(intervalId);
                setSimulationRunning(false); 
            } else {
                setExecutionStep(step);
                step++;
            }
        }, 1000); 
    };


    const snapToGrid = (x, y) => {
        const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
        return { x: snappedX, y: snappedY };
    };

    const onConnect = (params) => {
        const directedEdge = {
            ...params,
            animated: true,
            markerEnd: {
                type: 'arrowclosed',
            },
        };
        setEdges((eds) => addEdge(directedEdge, eds));
    };


    const onNodeClick = (e, node) => {
        setSelectedNode(node);
        setSelectedEdge(null); 
    };

    const onEdgeClick = (e, edge) => {
        setSelectedEdge(edge); 
        setSelectedNode(null); 
    };

    const deleteSelectedEdge = () => {
        if (selectedEdge) {
            setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
            setSelectedEdge(null);
            toast.success("Edge deleted successfully!");
        }
    };

    const handleDeleteNode = (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));

        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

        setSelectedNode(null);
    };

    const updateNodeProperties = (id, updatedProperties) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...updatedProperties } } : node
            )
        );
    };

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = "move";
    };

    const onDrop = (event) => {
        event.preventDefault();
        const canvasBounds = event.target.getBoundingClientRect();
        const position = {
            x: event.clientX - canvasBounds.left,
            y: event.clientY - canvasBounds.top,
        };

        const snappedPosition = snapToGrid(position.x, position.y);

        const nodeData = JSON.parse(event.dataTransfer.getData("application/reactflow"));
        const newNode = {
            id: uuid(),
            type: nodeData.type,
            position: snappedPosition,
            data: { label: nodeData.label },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const onNodesChangeWithSnap = (changes) => {
        const snappedChanges = changes.map((change) => {
            if (change.type === "position" && change.position) {
                return {
                    ...change,
                    position: snapToGrid(change.position.x, change.position.y),
                };
            }
            return change;
        });

        onNodesChange(snappedChanges);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleSave = () => {
        const validation = validateWorkflow(nodes, edges);
        if (validation.valid) {
            saveWorkflow(nodes, edges);
            toast.success("Workflow saved successfully!");
        } else {
            toast.error(validation.message);
        }
    };

    const validateWorkflow = (nodes, edges) => {
        const startNodes = nodes.filter((node) => node.data.label === "Start");
        const endNodes = nodes.filter((node) => node.data.label === "End");

        if (startNodes.length !== 1) {
            return { valid: false, message: "There should be exactly one 'Start' node." };
        }

        if (endNodes.length !== 1) {
            return { valid: false, message: "There should be exactly one 'End' node." };
        }

        const connectedNodes = new Set();
        edges.forEach((edge) => {
            connectedNodes.add(edge.source);
            connectedNodes.add(edge.target);
        });

        const disconnectedNodes = nodes.filter((node) => !connectedNodes.has(node.id));
        if (disconnectedNodes.length > 0) {
            return { valid: false, message: "There are disconnected nodes in the workflow." };
        }

        return { valid: true };
    };

    useEffect(() => {
        setNodes(persistedNodes.length > 0 ? persistedNodes : initialNodes);
        setEdges(persistedEdges.length > 0 ? persistedEdges : initialEdges);
    }, [persistedNodes, persistedEdges, setNodes, setEdges]);

    return (
        <div className="root-container">
            {/* Node Palette */}
            <div className="node-palette">
                <h3>Node Palette</h3>
                {nodePalette.map((node) => (
                    <div
                        key={node.label}
                        className="node-item"
                        draggable
                        onDragStart={(e) => onDragStart(e, node)}
                    >
                        {node.label}
                    </div>
                ))}
                <div style={{ marginTop: "auto" }}>
                    <WorkflowActions />
                    <SimulateExecution
                        nodes={nodes}
                        simulationRunning={simulationRunning}
                        executionStep={executionStep}
                    />
                    <button
                        onClick={startSimulation}
                        disabled={simulationRunning}
                        className="simulate-button"
                    >
                        Start Simulation
                    </button>
                </div>
            </div>
    
            {/* Canvas */}
            <div
                className="canvas"
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChangeWithSnap}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background gap={GRID_SIZE} />
                </ReactFlow>
                {/* Delete Edge Button */}
                {selectedEdge && (
                    <div className="delete-edge-dialog">
                        <span>
                            Delete edge between {selectedEdge.source} ➡️ {selectedEdge.target}?
                        </span>
                        <button
                            className="delete-button"
                            onClick={deleteSelectedEdge}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
    
            {/* Node Properties Sidebar */}
            <div className="sidebar">
                <NodePropertiesSidebar
                    selectedNode={selectedNode}
                    onUpdateNode={updateNodeProperties}
                    onDeleteNode={handleDeleteNode}
                />
            </div>
    
            {/* Save Workflow Button */}
            <button
                className="save-workflow-button"
                onClick={handleSave}
            >
                Save Workflow
            </button>
    
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );        
};

export default Canvas;