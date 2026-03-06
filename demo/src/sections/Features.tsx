import { useState } from "react";
import { Sparkline } from "react-tiny-sparkline";

const DATA = [5, 18, 12, 28, 8, 35, 22, 15, 30, 10, 25, 38, 20];
const UP_DATA = [8, 12, 10, 18, 15, 22, 20, 28, 25, 32, 30, 38, 35];
const DOWN_DATA = [35, 38, 30, 32, 25, 28, 20, 22, 15, 18, 10, 12, 8];
const FLAT_DATA = [20, 21, 19, 20, 21, 20, 19, 21, 20, 20, 21, 19, 20];

export function Features() {
	const [showMinMax, setShowMinMax] = useState(true);
	const [showTooltip, setShowTooltip] = useState(true);
	const [showTrend, setShowTrend] = useState(true);

	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-100 mb-2">Features</h2>
			<p className="text-zinc-400 mb-10">
				Tooltips, min/max markers, and trend indicators — all optional.
			</p>

			{/* Toggleable feature demo */}
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8">
				<div className="flex flex-wrap gap-6 justify-center mb-8">
					{[
						{ label: "Min/Max", checked: showMinMax, onChange: setShowMinMax },
						{ label: "Tooltip", checked: showTooltip, onChange: setShowTooltip },
						{ label: "Trend", checked: showTrend, onChange: setShowTrend },
					].map((toggle) => (
						<label
							key={toggle.label}
							className="inline-flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none"
						>
							<input
								type="checkbox"
								checked={toggle.checked}
								onChange={(e) => toggle.onChange(e.target.checked)}
								className="accent-violet-500"
							/>
							{toggle.label}
						</label>
					))}
				</div>

				<div className="flex justify-center">
					<Sparkline
						data={DATA}
						variant="area"
						color="#a78bfa"
						width={500}
						height={72}
						curved
						showMinMax={showMinMax}
						tooltip={showTooltip}
						formatTooltip={(v) => `${v} pts`}
						showTrend={showTrend}
					/>
				</div>

				{showTooltip && (
					<p className="text-xs text-zinc-600 text-center mt-4">
						Hover the chart to see values
					</p>
				)}
			</div>

			{/* Trend examples */}
			{showTrend && (
				<div className="mt-8 grid grid-cols-3 gap-4">
					{[
						{ data: UP_DATA, label: "Upward", color: "#4ade80" },
						{ data: DOWN_DATA, label: "Downward", color: "#f87171" },
						{ data: FLAT_DATA, label: "Flat", color: "#a1a1aa" },
					].map((item) => (
						<div
							key={item.label}
							className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-center"
						>
							<Sparkline
								data={item.data}
								color={item.color}
								width={120}
								height={28}
								showTrend
								curved
								animate={false}
							/>
							<p className="mt-2 text-xs text-zinc-500">{item.label}</p>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
