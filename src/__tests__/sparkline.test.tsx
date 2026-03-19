import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Sparkline } from "../sparkline.js";

afterEach(cleanup);

describe("Sparkline", () => {
	it("renders an SVG element", () => {
		render(<Sparkline data={[1, 2, 3]} />);
		const svg = screen.getByRole("img");
		expect(svg).toBeDefined();
		expect(svg.tagName).toBe("svg");
	});

	it("renders with empty data", () => {
		render(<Sparkline data={[]} />);
		const svg = screen.getByRole("img");
		expect(svg).toBeDefined();
	});

	it("renders line variant by default", () => {
		const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} />);
		const path = container.querySelector("path[stroke]");
		expect(path).not.toBeNull();
	});

	it("renders bar variant", () => {
		const { container } = render(<Sparkline data={[1, 2, 3]} variant="bar" />);
		const rects = container.querySelectorAll("rect");
		expect(rects.length).toBe(3);
	});

	it("renders dot variant", () => {
		const { container } = render(<Sparkline data={[1, 2, 3]} variant="dot" />);
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBe(3);
	});

	it("renders area variant with gradient", () => {
		const { container } = render(<Sparkline data={[1, 2, 3]} variant="area" />);
		const gradient = container.querySelector("linearGradient");
		expect(gradient).not.toBeNull();
	});

	it("shows min/max markers when enabled", () => {
		const { container } = render(<Sparkline data={[5, 1, 3, 8, 2]} showMinMax />);
		// Min marker (red) and Max marker (green) — 2 extra circles
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBeGreaterThanOrEqual(2);
	});

	it("shows trend indicator when enabled", () => {
		const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} showTrend />);
		expect(container.textContent).toContain("↑");
	});

	it("shows downward trend", () => {
		const { container } = render(<Sparkline data={[5, 4, 3, 2, 1]} showTrend />);
		expect(container.textContent).toContain("↓");
	});

	it("shows flat trend for constant data", () => {
		const { container } = render(<Sparkline data={[5, 5, 5, 5]} showTrend />);
		expect(container.textContent).toContain("→");
	});

	it("respects custom width and height", () => {
		render(<Sparkline data={[1, 2, 3]} width={200} height={50} />);
		const svg = screen.getByRole("img");
		expect(svg.getAttribute("width")).toBe("200");
		expect(svg.getAttribute("height")).toBe("50");
	});

	it("applies custom aria-label", () => {
		render(<Sparkline data={[1, 2, 3]} aria-label="Sales trend" />);
		const svg = screen.getByRole("img", { name: "Sales trend" });
		expect(svg).toBeDefined();
	});

	it("handles single data point", () => {
		const { container } = render(<Sparkline data={[5]} />);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("handles identical data points", () => {
		const { container } = render(<Sparkline data={[3, 3, 3, 3]} />);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders curved line variant", () => {
		const { container } = render(<Sparkline data={[1, 5, 2, 8, 3]} curved />);
		const path = container.querySelector("path");
		const d = path?.getAttribute("d") ?? "";
		expect(d).toContain("C"); // Cubic bezier curves
	});

	it("does not animate when animate=false", () => {
		const { container } = render(<Sparkline data={[1, 2, 3]} animate={false} />);
		const style = container.querySelector("style");
		expect(style).toBeNull();
	});

	it("renders custom tooltip content", () => {
		render(
			<Sparkline
				data={[1, 2, 3]}
				tooltip
				formatTooltip={(value) => `Custom: ${value}`}
			/>
		);

		const svg = screen.getByRole("img") as SVGElement;

		// Mock bounding box so mouse coordinates can be mapped to data indices
		svg.getBoundingClientRect = () =>
			({
				left: 0,
				top: 0,
				right: 300,
				bottom: 100,
				width: 300,
				height: 100,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			} as DOMRect);

		// Move mouse near the last data point (index 2, value 3)
		fireEvent.mouseMove(svg, { clientX: 290, clientY: 10 });

		const tooltip = screen.getByRole("tooltip");
		expect(tooltip).toBeDefined();
		expect(tooltip.textContent).toBe("Custom: 3");
	});

	it("renders custom tooltip element", () => {
		const CustomTooltip = ({ value }: { value: number }) => (
			<div className="custom-tooltip">Value is {value}</div>
		);

		render(
			<Sparkline
				data={[1, 2, 3]}
				tooltip
				renderTooltip={(value) => <CustomTooltip value={value} />}
			/>
		);

		const svg = screen.getByRole("img") as SVGElement;

		svg.getBoundingClientRect = () =>
			({
				left: 0,
				top: 0,
				right: 300,
				bottom: 100,
				width: 300,
				height: 100,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			} as DOMRect);

		// Move mouse near the last data point (index 2, value 3)
		fireEvent.mouseMove(svg, { clientX: 290, clientY: 10 });

		const tooltip = screen.getByRole("tooltip");
		expect(tooltip).toBeDefined();
		expect(tooltip.textContent).toBe("Value is 3");
	});


});
