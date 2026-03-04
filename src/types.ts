import type { CSSProperties, SVGAttributes } from "react";

/** Sparkline chart variant */
export type SparklineVariant = "line" | "area" | "bar" | "dot";

/** Trend direction */
export type TrendDirection = "up" | "down" | "flat";

/** Sparkline component props */
export interface SparklineProps {
	/** Data points to render */
	data: number[];
	/** Chart variant. Default: 'line' */
	variant?: SparklineVariant;
	/** Width in px. Default: 100 */
	width?: number;
	/** Height in px. Default: 32 */
	height?: number;
	/** Stroke color. Default: 'currentColor'. Also settable via --sparkline-color CSS variable. */
	color?: string;
	/** Fill color for area variant. Default: derived from color with opacity. */
	fillColor?: string;
	/** Stroke width. Default: 2 */
	strokeWidth?: number;
	/** Whether to animate on mount. Default: true */
	animate?: boolean;
	/** Animation duration in ms. Default: 500 */
	animationDuration?: number;
	/** Show min/max markers. Default: false */
	showMinMax?: boolean;
	/** Show trend indicator (arrow). Default: false */
	showTrend?: boolean;
	/** Enable tooltip on hover. Default: false */
	tooltip?: boolean;
	/** Format tooltip value. Default: String(value) */
	formatTooltip?: (value: number, index: number) => string;
	/** Padding inside SVG. Default: 2 */
	padding?: number;
	/** Bar gap ratio (0-1) for bar variant. Default: 0.2 */
	barGap?: number;
	/** Dot radius for dot variant. Default: 3 */
	dotRadius?: number;
	/** Curve the line. Default: false */
	curved?: boolean;
	/** Additional CSS class */
	className?: string;
	/** Additional inline styles */
	style?: CSSProperties;
	/** SVG props passthrough */
	svgProps?: SVGAttributes<SVGSVGElement>;
	/** Accessible label */
	"aria-label"?: string;
}
