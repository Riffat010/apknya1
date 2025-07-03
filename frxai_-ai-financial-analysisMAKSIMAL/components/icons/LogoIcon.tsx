import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => (
  <svg viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Blue Arc */}
    <path d="M19 65C28.1667 75.8333 54 80.5 75.5 57.5" stroke="#2563EB" strokeWidth="5" strokeLinecap="round"/>
    
    {/* Green Trend Line with Arrow */}
    <path d="M3.5 54.5L25 35.5L44.5 48L85.5 6.5" stroke="#10B981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M72 13.5L85.5 6.5L79.5 21" stroke="#10B981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Candlesticks */}
    <g>
        {/* Candle 1 */}
        <path d="M35 34V54" stroke="#34D399" strokeWidth="3" strokeLinecap="round"/>
        <rect x="31" y="40" width="8" height="10" fill="#10B981" rx="1"/>
    </g>
    <g>
        {/* Candle 2 */}
        <path d="M53 22V48" stroke="#34D399" strokeWidth="3" strokeLinecap="round"/>
        <rect x="49" y="30" width="8" height="14" fill="#10B981" rx="1"/>
    </g>
    <g>
        {/* Candle 3 */}
        <path d="M71 14V36" stroke="#34D399" strokeWidth="3" strokeLinecap="round"/>
        <rect x="67" y="20" width="8" height="12" fill="#10B981" rx="1"/>
    </g>
  </svg>
);
