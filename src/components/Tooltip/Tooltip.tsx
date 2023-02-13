import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import classes from "./Tooltip.module.scss";

interface TooltipProps {
  text: string;
  tooltipRef: React.Ref<HTMLDivElement>;
  tooltipType?: "top" | "bottom";
}
export const Tooltip: React.FC<TooltipProps> = ({
  text,
  tooltipRef,
  tooltipType = "top",
}) => {
  const [left, setLeft] = useState(0);
  // const left = useMemo(() => {
  //   // @ts-ignore
  //   const tooltip = tooltipRef.current;
  //   if (tooltip !== null) {
  //     const { width } = tooltip.getBoundingClientRect();
  //     return width / 2;
  //   } else return 0;
  // }, [tooltipRef]);

  useEffect(() => {
    // @ts-ignore
    const tooltip: HTMLDivElement = tooltipRef.current;
    if (tooltipRef !== null) {
      const { width } = tooltip.getBoundingClientRect();
      setLeft(width / 2 - 12);
    } else {
      setLeft(0);
    }

    // console.log(tooltipRef.current);
  }, [tooltipRef]);

  return (
    <div ref={tooltipRef} className={clsx(classes.tooltip)}>
      <div
        className={clsx(
          classes.tooltip_arrow,
          tooltipType === "top"
            ? classes.tooltip_arrow_to_botton
            : classes.tooltip_arrow_to_top
        )}
        style={{ left: `${left}px` }}
      ></div>
      <div style={{ position: "relative" }}>{text}</div>
    </div>
  );
};
