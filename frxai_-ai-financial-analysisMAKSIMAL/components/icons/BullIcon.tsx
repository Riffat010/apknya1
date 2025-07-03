import React from 'react';

export const BullIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a1.125 1.125 0 0 0 1.591 0L21.75 6M21.75 6v6.75M21.75 6h-6.75" />
  </svg>
);