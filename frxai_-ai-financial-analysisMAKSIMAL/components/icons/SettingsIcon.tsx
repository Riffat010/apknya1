import React from 'react';

export const SettingsIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.176.435c.58.116 1.022.612 1.022 1.208v.622c0 .642.448 1.203 1.074 1.416l2.12.707c.607.202 1.037.772 1.037 1.416v.622c0 .655-.499 1.231-1.155 1.416l-2.119.706c-.626.208-1.074.774-1.074 1.416v.622c0 .596-.442 1.092-1.022 1.208l-2.176.434c-.55.11-1.02-.41-1.11-.952l-.434-2.176c-.116-.58-.612-1.022-1.208-1.022h-.622c-.642 0-1.203-.448-1.416-1.074l-.707-2.12c-.202-.607.228-1.283.834-1.464l.946-.284c.59-.177 1.012-.68 1.012-1.297v-.622c0-.596.442-1.092 1.022-1.208l2.176-.435Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    </svg>
);