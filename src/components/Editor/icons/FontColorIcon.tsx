import React from "react";

interface FontColorIcon {
  color?: string;
}
export const FontColorIcon: React.FC<FontColorIcon> = ({ color = "white" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.6598 14H2.79616L6.98366 2.36364H9.01207L13.1996 14H11.3359L8.04616 4.47727H7.95526L4.6598 14ZM4.9723 9.44318H11.0178V10.9205H4.9723V9.44318Z"
      fill={color}
    />
  </svg>
);
