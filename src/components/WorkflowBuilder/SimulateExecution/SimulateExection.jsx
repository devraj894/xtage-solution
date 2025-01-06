import React, { useEffect } from "react";

const SimulateExecution = ({ nodes, simulationRunning, executionStep }) => {
    useEffect(() => {
        if (simulationRunning) {
            nodes.forEach((node, index) => {
                if (index === executionStep) {
                    node.style = { ...node.style, border: "2px solid yellow" }; 
                } else {
                    node.style = { ...node.style, border: "none" }; 
                }
            });
        }
    }, [executionStep, simulationRunning, nodes]);

    return null; 
};

export default SimulateExecution;
