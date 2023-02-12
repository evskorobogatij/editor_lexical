import React from "react";
import classes from "./Tooltip.module.scss";

interface TooltipProps {
  text: string;
  tooltipRef: React.Ref<HTMLDivElement>;
}
export const Tooltip: React.FC<TooltipProps> = ({ text, tooltipRef }) => (
  <div ref={tooltipRef} className={classes.tooltip}>
    {text}
  </div>
);
