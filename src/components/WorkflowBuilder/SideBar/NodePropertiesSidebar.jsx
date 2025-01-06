import React, { useState, useEffect } from "react";
import "./sidebar.css"

const NodePropertiesSidebar = ({ selectedNode, onUpdateNode, onDeleteNode }) => {
  const [nodeProperties, setNodeProperties] = useState({
    label: selectedNode?.data?.label || "",
    executionTime: selectedNode?.data?.executionTime || 0,
    type: selectedNode?.data?.type || "default", 
  });

  useEffect(() => {
    setNodeProperties({
      label: selectedNode?.data?.label || "",
      executionTime: selectedNode?.data?.executionTime || 0,
      type: selectedNode?.data?.type || "default", 
    });
  }, [selectedNode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNodeProperties({
      ...nodeProperties,
      [name]: value,
    });
  };

  const handleSave = () => {
    onUpdateNode(selectedNode.id, nodeProperties);
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);  
    }
  };

  if (!selectedNode) {
    return (
      <div className="sidebar no-node">
        <p>Please select a node to view and edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Node Properties</h3>
      <div className="form-group">
        <label htmlFor="label">Label:</label>
        <input
          type="text"
          id="label"
          name="label"
          value={nodeProperties.label}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="executionTime">Execution Time:</label>
        <input
          type="number"
          id="executionTime"
          name="executionTime"
          value={nodeProperties.executionTime}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Node Type:</label>
        <select
          id="type"
          name="type"
          value={nodeProperties.type}
          onChange={handleInputChange}
        >
          <option value="default">Default</option>
          <option value="input">Input</option>
          <option value="output">Output</option>
          <option value="processing">Processing</option>
        </select>
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
      <button className="delete-btn" onClick={handleDelete} style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>
        Delete Node
      </button>
    </div>
  );
};

export default NodePropertiesSidebar;