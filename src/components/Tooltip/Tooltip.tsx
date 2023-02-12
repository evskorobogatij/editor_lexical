import clsx from "clsx";
import React, { useEffect, useMemo } from "react";
import classes from "./Tooltip.module.scss";

interface TooltipProps {
  text: string;
  tooltipRef: React.Ref<HTMLDivElement>;
}
export const Tooltip: React.FC<TooltipProps> = ({ text, tooltipRef }) => {
  //  const left = useMemo(()=>{
  //     const tootip = tooltipRef.current
  //   if(tooltipRef!==null){
  //       const s =
  //   }

  //  },[tooltipRef])
  //   useEffect(() => {
  //     if (tooltipRef !== null) {
  //       const tootip = tooltipRef.current;
  //     }

  //     console.log(tooltipRef.current);
  //   }, [tooltipRef]);

  return (
    <div ref={tooltipRef} className={clsx(classes.tooltip)}>
      <div
        className={clsx(classes.tooltip_arrow)}
        style={{ left: `${text}px` }}
      ></div>
      <div style={{ position: "relative" }}>{text}</div>
    </div>
  );
};
