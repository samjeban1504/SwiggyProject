import React from 'react';

const LoadingSpinner = ({ message = 'Loading deliciousness...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-warning" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-bold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
