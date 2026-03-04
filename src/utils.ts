import type { TrendDirection } from "./types.js";

export interface Point {
	x: number;
	y: number;
}

export function normalizeData(
	data: number[],
	width: number,
	height: number,
	padding: number,
): Point[] {
	if (data.length === 0) return [];

	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1; // Division by zero guard

	const innerW = width - padding * 2;
	const innerH = height - padding * 2;
	const step = data.length > 1 ? innerW / (data.length - 1) : 0;

	return data.map((value, i) => ({
		x: padding + i * step,
		y: padding + innerH - ((value - min) / range) * innerH,
	}));
}

export function pointsToPath(points: Point[]): string {
	if (points.length === 0) return "";
	return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

export function pointsToCurvedPath(points: Point[]): string {
	if (points.length < 2) return pointsToPath(points);

	let path = `M${points[0].x},${points[0].y}`;
	for (let i = 0; i < points.length - 1; i++) {
		const curr = points[i];
		const next = points[i + 1];
		const cpx = (curr.x + next.x) / 2;
		path += ` C${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
	}
	return path;
}

export function getMinMaxIndices(data: number[]): { minIndex: number; maxIndex: number } {
	let minIndex = 0;
	let maxIndex = 0;
	for (let i = 1; i < data.length; i++) {
		if (data[i] < data[minIndex]) minIndex = i;
		if (data[i] > data[maxIndex]) maxIndex = i;
	}
	return { minIndex, maxIndex };
}

export function getTrend(data: number[]): TrendDirection {
	if (data.length < 2) return "flat";
	const first = data[0];
	const last = data[data.length - 1];
	const threshold = (Math.max(...data) - Math.min(...data)) * 0.05;
	if (last - first > threshold) return "up";
	if (first - last > threshold) return "down";
	return "flat";
}

export function calculatePathLength(points: Point[]): number {
	let length = 0;
	for (let i = 1; i < points.length; i++) {
		const dx = points[i].x - points[i - 1].x;
		const dy = points[i].y - points[i - 1].y;
		length += Math.sqrt(dx * dx + dy * dy);
	}
	return length;
}
