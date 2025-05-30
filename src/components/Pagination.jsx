import React from 'react';

export default function Pagination({ total, perPage, onPageChange }) {
  const pages = Math.ceil(total / perPage);

  return (
    <div className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
