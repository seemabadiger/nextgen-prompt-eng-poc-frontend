import React from 'react';
import { Spinner } from 'react-bootstrap';

const OverlayLoader = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050, // Ensure it's on top of other elements
      }}
    >
      <Spinner animation="border" variant="light" />
    </div>
  );
};

export default OverlayLoader;
