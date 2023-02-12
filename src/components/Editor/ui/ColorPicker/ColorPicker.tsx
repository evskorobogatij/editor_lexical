import "./ColorPicker.scss";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";

import { DropDown } from "../DropDown";
import { FontColorIcon } from "../../icons/FontColorIcon";
// import TextInput from './TextInput';

interface ColorPickerProps {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  // buttonIconClassName?: string;
  icon: JSX.Element;
  buttonLabel?: string;
  color: string;
  bgColor: string;
  children?: ReactNode;
  onTextColorChange?: (color: string) => void;
  onBgColorChange?: (color: string) => void;
  clearFontColor?: () => void;
  title?: string;
  tooltip?: string;
}

const mainTextColors = [
  "#FB7575",
  "#FF9B60",
  "#FFD45C",
  "#73DE91",
  "#87C2FB",
  "#C98AF5",
  "#FF81DB",
  "#B0B0B0",
];

const mainBackgroundColors = [
  "#452D2D",
  "#67371A",
  "#3F351B",
  "#1D3E26",
  "#26374F",
  "#3F2C51",
  "#442A3E",
  "#4B4B4B",
];

const WIDTH = 140;
const HEIGHT = 150;

export default function ColorPicker({
  color,
  bgColor,
  children,
  onTextColorChange,
  onBgColorChange,
  clearFontColor,
  disabled = false,
  ...rest
}: Readonly<ColorPickerProps>): JSX.Element {
  const [selfColor, setSelfColor] = useState(transformColor("hex", color));
  const [inputColor, setInputColor] = useState(color);

  const [selfBgColor, setSelfBgColor] = useState(
    transformColor("hex", bgColor)
  );
  const [bgInputColor, setBgInputColor] = useState(color);

  const innerDivRef = useRef(null);

  useEffect(() => {
    // Check if the dropdown is actually active
    if (innerDivRef.current !== null && onTextColorChange) {
      onTextColorChange(selfColor.hex);
      setInputColor(selfColor.hex);
    }
  }, [selfColor, onTextColorChange]);

  useEffect(() => {
    if (innerDivRef.current !== null && onBgColorChange) {
      onBgColorChange(selfBgColor.hex);
      setInputColor(selfBgColor.hex);
    }
  }, [selfBgColor, onBgColorChange]);

  useEffect(() => {
    if (color === undefined) return;
    const newColor = transformColor("hex", color);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  }, [color]);

  useEffect(() => {
    if (bgColor === undefined) return;
    const newColor = transformColor("hex", bgColor);
    setSelfBgColor(newColor);
    setBgInputColor(newColor.hex);
  }, [bgColor]);

  return (
    <DropDown {...rest} disabled={disabled} stopCloseOnClickSelf={true}>
      <div
        className="color-picker-wrapper"
        style={{ width: WIDTH }}
        ref={innerDivRef}
      >
        {/* <div>{inputColor}</div>
        <div>T {color}</div> */}
        {/* <div className="color-picker-basic-color">
          {basicColors.map((basicColor) => (
            <button
              className={basicColor === selfColor.hex ? " active" : ""}
              key={basicColor}
              style={{ backgroundColor: basicColor }}
              onClick={() => {
                setInputColor(basicColor);
                setSelfColor(transformColor("hex", basicColor));
              }}
            />
          ))}
        </div> */}

        <div className="color-picker-container">
          {mainTextColors.map((textColor) => (
            <button
              key={textColor}
              style={{
                color: textColor,
                ...(color === textColor && { borderColor: textColor }),
              }}
              onClick={() => {
                setInputColor(textColor);
                setSelfColor(transformColor("hex", textColor));
              }}
            >
              <FontColorIcon color={textColor} />
            </button>
          ))}
        </div>

        <div className="color-picker-container">
          {mainBackgroundColors.map((color) => (
            <button
              key={color}
              style={{
                backgroundColor: color,
                ...(color === bgColor && { borderColor: "#FF9B60" }),
              }}
              onClick={() => {
                setBgInputColor(color);
                setSelfBgColor(transformColor("hex", color));
              }}
            >
              <FontColorIcon />
            </button>
          ))}
        </div>

        <div className="color-picker-buttons">
          <button onClick={clearFontColor}>Очистить</button>
        </div>
      </div>
      {children}
    </DropDown>
  );
}

export interface Position {
  x: number;
  y: number;
}

function clamp(value: number, max: number, min: number) {
  return value > max ? max : value < min ? min : value;
}

interface RGB {
  b: number;
  g: number;
  r: number;
}
interface HSV {
  h: number;
  s: number;
  v: number;
}
interface Color {
  hex: string;
  hsv: HSV;
  rgb: RGB;
}

export function toHex(value: string): string {
  if (!value.startsWith("#")) {
    const ctx = document.createElement("canvas").getContext("2d");

    if (!ctx) {
      throw new Error("2d context not supported or canvas already initialized");
    }

    ctx.fillStyle = value;

    return ctx.fillStyle;
  } else if (value.length === 4 || value.length === 5) {
    value = value
      .split("")
      .map((v, i) => (i ? v + v : "#"))
      .join("");

    return value;
  } else if (value.length === 7 || value.length === 9) {
    return value;
  }

  return "#000000";
}

function hex2rgb(hex: string): RGB {
  const rbgArr = (
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g) || []
  ).map((x) => parseInt(x, 16));

  return {
    b: rbgArr[2],
    g: rbgArr[1],
    r: rbgArr[0],
  };
}

function rgb2hsv({ r, g, b }: RGB): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);

  const h = d
    ? (max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
        ? 2 + (b - r) / d
        : 4 + (r - g) / d) * 60
    : 0;
  const s = max ? (d / max) * 100 : 0;
  const v = max * 100;

  return { h, s, v };
}

function hsv2rgb({ h, s, v }: HSV): RGB {
  s /= 100;
  v /= 100;

  const i = ~~(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  const index = i % 6;

  const r = Math.round([v, q, p, p, t, v][index] * 255);
  const g = Math.round([t, v, v, q, p, p][index] * 255);
  const b = Math.round([p, p, t, v, v, q][index] * 255);

  return { b, g, r };
}

function rgb2hex({ b, g, r }: RGB): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function transformColor<M extends keyof Color, C extends Color[M]>(
  format: M,
  color: C
): Color {
  let hex: Color["hex"] = toHex("#121212");
  let rgb: Color["rgb"] = hex2rgb(hex);
  let hsv: Color["hsv"] = rgb2hsv(rgb);

  if (format === "hex") {
    const value = color as Color["hex"];

    hex = toHex(value);
    rgb = hex2rgb(hex);
    hsv = rgb2hsv(rgb);
  } else if (format === "rgb") {
    const value = color as Color["rgb"];

    rgb = value;
    hex = rgb2hex(rgb);
    hsv = rgb2hsv(rgb);
  } else if (format === "hsv") {
    const value = color as Color["hsv"];

    hsv = value;
    rgb = hsv2rgb(hsv);
    hex = rgb2hex(rgb);
  }

  return { hex, hsv, rgb };
}
