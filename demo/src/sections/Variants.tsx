import { useState } from "react";
import { Sparkline } from "react-tiny-sparkline";
import type { SparklineVariant } from "react-tiny-sparkline";

const SAMPLE_DATA = [12, 25, 8, 32, 18, 42, 15, 35, 22, 28, 10, 38, 20, 30];

const variants: { value: SparklineVariant; label: string; description: string }[] = [
	{ value: "line", label: "Line", description: "Default. Clean stroke path." },
	{ value: "area", label: "Area", description: "Line with gradient fill below." },
	{ value: "bar", label: "Bar", description: "Vertical bars for discrete data." },
	{ value: "dot", label: "Dot", description: "Dot plot for sparse data points." },
];

export function Variants() {
	const [active, setActive] = useState<SparklineVariant>("line");
	const [curved, setCurved] = useState(false);

	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-100 mb-2">Variants</h2>
			<p className="text-zinc-400 mb-10">Four built-in chart types. Click to switch.</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
				{variants.map((v) => (
					<button
						key={v.value}
						type="button"
						onClick={() => setActive(v.value)}
						className={`text-left rounded-lg border p-5 transition-colors ${
							active === v.value
							? "border-violet-500/50 bg-violet-500/5"
							: "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
							}`}
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-medium text-zinc-200">{v.label}</span>
							<Sparkline
								data={SAMPLE_DATA}
								variant={v.value}
								color={active === v.value ? "#a78bfa" : "#71717a"}
								width={100}
								height={28}
								curved={curved && (v.value === active) && (v.value === "line" || v.value === "area")}
								animate={false}
							/>
						</div>
						<p className="text-xs text-zinc-500">{v.description}</p>
					</button>
				))}
			</div>

			{/* Large preview */}
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center h-48">
				<Sparkline
					data={SAMPLE_DATA}
					variant={active}
					color="#a78bfa"
					width={600}
					height={80}
					strokeWidth={2.5}
					curved={curved && (active === "line" || active === "area")}
					tooltip
					formatTooltip={(v) => `${v} units`}
				/>
				{active === "line" || active === "area" ? <div className="mt-6 flex justify-center gap-4">
					<label className="inline-flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={curved}
							onChange={(e) => setCurved(e.target.checked)}
							className="accent-violet-500"
						/>
						Curved
					</label>
				</div> : null }
			</div>
		</section>
	);
}
