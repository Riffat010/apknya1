
import React from 'react';

export const ChartSquareIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 15l3-3 2 2 4-4" />
  </svg>
);
