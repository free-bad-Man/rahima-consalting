import React from "react";

interface YandexIconProps {
  className?: string;
  size?: number;
}

export default function YandexIcon({ className = "w-4 h-4", size }: YandexIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.04 22h15.92c1.04 0 1.885-.844 1.885-1.885V3.885C19.845 2.844 19 2 17.96 2H2.04C.996 2 .152 2.844.152 3.885v16.23C.152 21.156.996 22 2.04 22zM14.55 13.702H9.095l-.342 2.814a.234.234 0 01-.229.198h-2.23a.234.234 0 01-.23-.198L4.72 5.13a.234.234 0 01.228-.271h2.746a.234.234 0 01.229.198l.685 5.644h5.893c.736 0 1.325.443 1.575 1.125.15.42.15.889 0 1.31-.25.682-.839 1.125-1.575 1.125z" />
    </svg>
  );
}

