import React from "react";

interface MaxIconProps {
  className?: string;
  size?: number;
}

export default function MaxIcon({ className = "w-4 h-4", size }: MaxIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.422 2.429c.292-.292.77-.292 1.062 0l7.07 7.071a.75.75 0 010 1.06l-7.07 7.072a.75.75 0 01-1.062 0L6.352 10.56a.75.75 0 010-1.06l7.07-7.071zm-2.844 0c.292-.292.77-.292 1.062 0l7.07 7.071a.75.75 0 010 1.06l-7.07 7.072a.75.75 0 01-1.062 0L3.508 10.56a.75.75 0 010-1.06l7.07-7.071zm-2.844 0c.292-.292.77-.292 1.062 0l7.07 7.071a.75.75 0 010 1.06l-7.07 7.072a.75.75 0 01-1.062 0L.664 10.56a.75.75 0 010-1.06l7.07-7.071z" />
    </svg>
  );
}

