import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "../Tooltip";

interface ToolbarBottonProps {
  handleClick: () => void;
  className: string;
  ariaLabeles: string;
  icon: JSX.Element;
  tooltip?: string;
  tooltipType?: "top" | "bottom";
}
export const ToolbarButton: React.FC<ToolbarBottonProps> = ({
  handleClick,
  className,
  ariaLabeles,
  icon,
  tooltip,
  tooltipType = "top",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTootip] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const tooltip = tooltipRef.current;

    if (showTooltip && button !== null && tooltip !== null) {
      const { top, left, width } = button.getBoundingClientRect();
      const { width: tooltipWidth } = tooltip.getBoundingClientRect();
      tooltip.style.top =
        tooltipType === "top" ? `${top - 38}px` : `${top + 40}px`;
      tooltip.style.left = `${Math.min(
        left - tooltipWidth / 2 + width / 2,
        window.innerWidth - tooltip.offsetWidth - 20
      )}px`;
    }
  }, [tooltipRef, buttonRef, showTooltip]);

  const handleEnter = () => {
    console.log(
      buttonRef.current?.getBoundingClientRect,
      buttonRef.current?.getClientRects
    );
    setShowTootip(true);
  };

  const handleLeave = () => {
    setShowTootip(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        aria-label={ariaLabeles}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        ref={buttonRef}
      >
        {icon}
      </button>
      {showTooltip &&
        tooltip !== undefined &&
        createPortal(
          <Tooltip
            tooltipRef={tooltipRef}
            text={tooltip ?? ""}
            tooltipType={tooltipType}
          />,
          document.body
        )}
    </>
  );
};
