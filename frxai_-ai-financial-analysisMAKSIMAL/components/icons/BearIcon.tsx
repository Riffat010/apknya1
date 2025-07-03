import React from 'react';

export const BearIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.306a1.125 1.125 0 0 1 1.591 0L21.75 18M21.75 18v-6.75M21.75 18h-6.75" />
  </svg>
);