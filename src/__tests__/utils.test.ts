import { describe, expect, it } from "vitest";
import { getMinMaxIndices, getTrend, normalizeData, pointsToPath } from "../utils.js";

describe("normalizeData", () => {
	it("returns empty array for empty data", () => {
		expect(normalizeData([], 100, 32, 2)).toEqual([]);
	});

	it("normalizes data to fit within dimensions", () => {
		const points = normalizeData([0, 50, 100], 100, 32, 2);
		expect(points.length).toBe(3);
		// First point should be at bottom-left area
		expect(points[0].x).toBe(2);
		expect(points[0].y).toBe(30); // padding + innerH (bottom)
		// Last point should be at top-right area
		expect(points[2].x).toBe(98);
		expect(points[2].y).toBe(2); // padding (top)
	});

	it("handles single data point", () => {
		const points = normalizeData([5], 100, 32, 2);
		expect(points.length).toBe(1);
		expect(points[0].x).toBe(2);
	});

	it("handles identical values without division by zero", () => {
		const points = normalizeData([5, 5, 5], 100, 32, 2);
		expect(points.length).toBe(3);
		// All points should be valid (no NaN)
		for (const p of points) {
			expect(Number.isNaN(p.x)).toBe(false);
			expect(Number.isNaN(p.y)).toBe(false);
		}
	});
});

describe("pointsToPath", () => {
	it("returns empty string for empty points", () => {
		expect(pointsToPath([])).toBe("");
	});

	it("creates SVG path from points", () => {
		const path = pointsToPath([
			{ x: 0, y: 10 },
			{ x: 50, y: 5 },
			{ x: 100, y: 20 },
		]);
		expect(path).toBe("M0,10 L50,5 L100,20");
	});
});

describe("getMinMaxIndices", () => {
	it("finds correct min and max indices", () => {
		const { minIndex, maxIndex } = getMinMaxIndices([3, 1, 5, 2, 4]);
		expect(minIndex).toBe(1);
		expect(maxIndex).toBe(2);
	});

	it("handles single element", () => {
		const { minIndex, maxIndex } = getMinMaxIndices([5]);
		expect(minIndex).toBe(0);
		expect(maxIndex).toBe(0);
	});
});

describe("getTrend", () => {
	it("detects upward trend", () => {
		expect(getTrend([1, 2, 3, 4, 5])).toBe("up");
	});

	it("detects downward trend", () => {
		expect(getTrend([5, 4, 3, 2, 1])).toBe("down");
	});

	it("detects flat trend", () => {
		expect(getTrend([5, 5, 5, 5])).toBe("flat");
	});

	it("returns flat for single data point", () => {
		expect(getTrend([5])).toBe("flat");
	});

	it("returns flat for empty data", () => {
		expect(getTrend([])).toBe("flat");
	});
});
