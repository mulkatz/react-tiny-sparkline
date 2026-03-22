import { useId, useMemo, useRef, useState } from "react";
import type { SparklineProps } from "./types.js";
import {
	calculatePathLength,
	getMinMaxIndices,
	getTrend,
	normalizeData,
	pointsToCurvedPath,
	pointsToPath,
} from "./utils.js";

const TREND_ARROWS: Record<string, string> = {
	up: "↑",
	down: "↓",
	flat: "→",
};

export function Sparkline({
	data,
	variant = "line",
	width = 100,
	height = 32,
	color,
	fillColor,
	strokeWidth = 2,
	animate = true,
	animationDuration = 500,
	showMinMax = false,
	showTrend = false,
	tooltip = false,
	formatTooltip,
	tooltipStyle,
	renderTooltip,
	padding = 2,
	barGap = 0.2,
	dotRadius = 3,
	curved = false,
	className,
	style,
	svgProps,
	"aria-label": ariaLabel,
}: SparklineProps) {
	const gradientId = useId();
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
	const svgRef = useRef<SVGSVGElement>(null);

	const points = useMemo(
		() => normalizeData(data, width, height, padding),
		[data, width, height, padding],
	);

	const pathD = useMemo(() => {
		if (points.length === 0) return "";
		return curved ? pointsToCurvedPath(points) : pointsToPath(points);
	}, [points, curved]);

	const pathLength = useMemo(() => calculatePathLength(points), [points]);
	const { minIndex, maxIndex } = useMemo(() => getMinMaxIndices(data), [data]);
	const trend = useMemo(() => getTrend(data), [data]);

	const strokeColor = color ?? "var(--sparkline-color, currentColor)";
	const areaFill = fillColor ?? "var(--sparkline-fill, currentColor)";

	const animStyle = animate
		? {
				strokeDasharray: pathLength,
				strokeDashoffset: pathLength,
				animation: `sparkline-draw ${animationDuration}ms ease forwards`,
			}
		: undefined;

	const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
		if (!tooltip || data.length === 0) return;
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		if (rect.width <= 0) return;
		const relX = e.clientX - rect.left;
		const ratio = relX / rect.width;
		const index = Math.round(ratio * (data.length - 1));
		if (!Number.isFinite(index)) return;
		setHoveredIndex(Math.max(0, Math.min(data.length - 1, index)));
		setTooltipPosition({ x: e.clientX, y: e.clientY });
	};

	const handleMouseLeave = () => {
		setHoveredIndex(null);
		setTooltipPosition(null);
	};

	if (data.length === 0) {
		return (
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={ariaLabel ?? "Empty sparkline"}
				className={className}
				style={style}
				{...svgProps}
			/>
		);
	}

	const tooltipText =
		hoveredIndex !== null
			? formatTooltip
				? formatTooltip(data[hoveredIndex], hoveredIndex)
				: String(data[hoveredIndex])
			: null;
	
	
	const tooltipOffset = 8;
	const clampedTooltipPosition =
		tooltipPosition && typeof window !== "undefined"
			? {
				left: Math.max(
					tooltipOffset,
					Math.min(
						window.innerWidth - tooltipOffset,
						tooltipPosition.x + tooltipOffset,
					),
				),
				top: Math.max(
					tooltipOffset,
					Math.min(
						window.innerHeight - tooltipOffset,
						tooltipPosition.y - tooltipOffset,
					),
				),
			}
			: null;

	return (
		<>
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: showTrend ? "0.25em" : undefined,
				...style,
			}}	
			className={className}
			tabIndex={0}
			aria-describedby={
				tooltip && tooltipText && tooltipPosition ? "sparkline-tooltip" : undefined
			}	
	    >
			<svg
				ref={svgRef}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={ariaLabel ?? `Sparkline chart with ${data.length} data points`}
				onMouseMove={tooltip ? handleMouseMove : undefined}
				onMouseLeave={tooltip ? handleMouseLeave : undefined}
				style={{ overflow: "visible" }}
				{...svgProps}
			>
				{animate && (
					<style>
						{
							"@keyframes sparkline-draw { to { stroke-dashoffset: 0 } } @keyframes sparkline-fade { from { opacity: 0 } to { opacity: 1 } }"
						}
					</style>
				)}

				{variant === "area" && (
					<>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor={areaFill} stopOpacity="0.3" />
								<stop offset="100%" stopColor={areaFill} stopOpacity="0.05" />
							</linearGradient>
						</defs>
						<path
							d={`${pathD} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`}
							fill={`url(#${gradientId})`}
							stroke="none"
							style={
								animate
									? { animation: `sparkline-fade ${animationDuration}ms ease forwards` }
									: undefined
							}
						/>
					</>
				)}

				{(variant === "line" || variant === "area") && (
					<path
						d={pathD}
						fill="none"
						stroke={strokeColor}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeLinejoin="round"
						style={animStyle}
					/>
				)}

				{variant === "bar" && (
					<g
						style={
							animate
								? { animation: `sparkline-fade ${animationDuration}ms ease forwards` }
								: undefined
						}
					>
						{renderBars(data, width, height, padding, barGap, strokeColor)}
					</g>
				)}

				{variant === "dot" && (
					<g
						style={
							animate
								? { animation: `sparkline-fade ${animationDuration}ms ease forwards` }
								: undefined
						}
					>
						{points.map((p) => (
							<circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={dotRadius} fill={strokeColor} />
						))}
					</g>
				)}

				{showMinMax && points.length > 0 && (
					<>
						<circle
							cx={points[minIndex].x}
							cy={points[minIndex].y}
							r={3}
							fill="var(--sparkline-min, #ef4444)"
						/>
						<circle
							cx={points[maxIndex].x}
							cy={points[maxIndex].y}
							r={3}
							fill="var(--sparkline-max, #22c55e)"
						/>
					</>
				)}
			</svg>
			{showTrend && (
				<span
					aria-label={`Trend: ${trend}`}
					style={{
						color:
							trend === "up"
								? "var(--sparkline-trend-up, #22c55e)"
								: trend === "down"
									? "var(--sparkline-trend-down, #ef4444)"
									: "var(--sparkline-trend-flat, currentColor)",
						fontSize: "0.75em",
						lineHeight: 1,
					}}
				>
					{TREND_ARROWS[trend]}
				</span>
			)}
		</span>
		{tooltip && hoveredIndex !== null && tooltipPosition && (
			<div
				id="sparkline-tooltip"
				role="tooltip"
				style={{
					position: "fixed",
					...(clampedTooltipPosition ?? {}),
					pointerEvents: "none",
					zIndex: 9999,
					backgroundColor: "rgba(0, 0, 0, 0.9)",
					color: "#fff",
					padding: "4px 8px",
					borderRadius: "4px",
					fontSize: "12px",
					whiteSpace: "nowrap",
					fontFamily: "system-ui, -apple-system, sans-serif",
					...tooltipStyle,
					}}
			>
			{renderTooltip ? renderTooltip(data[hoveredIndex], hoveredIndex) : tooltipText}
			</div>
		)}
	</>
	);
}

function renderBars(
	data: number[],
	width: number,
	height: number,
	padding: number,
	gapRatio: number,
	color: string,
) {
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const innerW = width - padding * 2;
	const innerH = height - padding * 2;
	const totalBarWidth = innerW / data.length;
	const barWidth = totalBarWidth * (1 - gapRatio);
	const gap = totalBarWidth * gapRatio;

	return data.map((value, i) => {
		const barH = ((value - min) / range) * innerH;
		const safeH = Math.max(barH, 1); // Ensure minimum 1px height
		return (
			<rect
				key={`${i}-${value}`}
				x={padding + i * totalBarWidth + gap / 2}
				y={padding + innerH - safeH}
				width={Math.max(barWidth, 1)}
				height={safeH}
				fill={color}
				rx={1}
			/>
		);
	});
}
