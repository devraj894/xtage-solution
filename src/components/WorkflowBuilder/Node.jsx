import React from 'react';
import Draggable from 'react-draggable';

const Node = ({ label, position }) => {
  return (
    <Draggable>
      <div style={{ top: position.y, left: position.x }}>
        {label}
      </div>
    </Draggable>
  );
};

export default Node;
