
import React from 'react';

export const BarChartIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.75h4.5v6.75H3v-6.75zM16.5 6h4.5v13.5h-4.5V6zM9.75 9h4.5v10.5h-4.5V9z" />
    </svg>
);
