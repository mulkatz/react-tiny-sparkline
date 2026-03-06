import { useState } from "react";
import { Sparkline } from "react-tiny-sparkline";

const DATA = [8, 15, 12, 25, 18, 30, 22, 28, 20, 35, 25, 32];

const themes = [
	{ name: "Violet", color: "#a78bfa", fill: "#a78bfa" },
	{ name: "Emerald", color: "#34d399", fill: "#34d399" },
	{ name: "Amber", color: "#fbbf24", fill: "#fbbf24" },
	{ name: "Rose", color: "#fb7185", fill: "#fb7185" },
	{ name: "Sky", color: "#38bdf8", fill: "#38bdf8" },
	{ name: "Zinc", color: "#a1a1aa", fill: "#a1a1aa" },
];

export function Theming() {
	const [activeTheme, setActiveTheme] = useState(0);
	const theme = themes[activeTheme];

	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-100 mb-2">Theming</h2>
			<p className="text-zinc-400 mb-10">
				Pass color props directly or use CSS Custom Properties for global theming.
			</p>

			{/* Color picker */}
			<div className="flex flex-wrap gap-2 mb-8">
				{themes.map((t, i) => (
					<button
						key={t.name}
						type="button"
						onClick={() => setActiveTheme(i)}
						className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
							activeTheme === i
								? "text-zinc-100 border border-zinc-600"
								: "text-zinc-500 border border-zinc-800 hover:border-zinc-700"
						}`}
						style={activeTheme === i ? { borderColor: t.color } : undefined}
					>
						<span
							className="inline-block w-2 h-2 rounded-full mr-1.5"
							style={{ backgroundColor: t.color }}
						/>
						{t.name}
					</button>
				))}
			</div>

			{/* Themed sparklines */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{(["line", "area", "bar", "dot"] as const).map((variant) => (
					<div
						key={variant}
						className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5"
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs text-zinc-500 uppercase tracking-wider">
								{variant}
							</span>
						</div>
						<Sparkline
							data={DATA}
							variant={variant}
							color={theme.color}
							fillColor={theme.fill}
							width={280}
							height={40}
							curved={variant === "line" || variant === "area"}
							showMinMax
						/>
					</div>
				))}
			</div>

			{/* CSS variables code example */}
			<div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
				<p className="text-xs text-zinc-500 mb-3">CSS Custom Properties</p>
				<pre className="text-xs text-zinc-400 overflow-x-auto">
					<code>{`:root {
  --sparkline-color: ${theme.color};
  --sparkline-fill: ${theme.fill};
  --sparkline-min: #ef4444;
  --sparkline-max: #22c55e;
}`}</code>
				</pre>
			</div>
		</section>
	);
}
