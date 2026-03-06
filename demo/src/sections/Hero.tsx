import { useEffect, useState } from "react";
import { Sparkline } from "react-tiny-sparkline";

function useAnimatedData(base: number[], interval = 2000): number[] {
	const [data, setData] = useState(base);
	useEffect(() => {
		const id = setInterval(() => {
			setData((prev) => {
				const next = [...prev.slice(1), Math.round(Math.random() * 40 + 10)];
				return next;
			});
		}, interval);
		return () => clearInterval(id);
	}, [interval]);
	return data;
}

export function Hero() {
	const liveData = useAnimatedData([18, 25, 12, 35, 28, 42, 15, 30, 22, 38, 20, 33]);

	return (
		<section className="py-24 text-center">
			<h1 className="text-5xl font-bold tracking-tight text-zinc-50 mb-4">
				react-tiny-sparkline
			</h1>
			<p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16">
				Tiny inline SVG sparkline charts for React. Line, area, bar, dot — with tooltips and
				animations. &lt;2KB gzipped.
			</p>

			{/* Live sparkline hero */}
			<div className="inline-flex items-center gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-6">
				<div className="text-left">
					<p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Revenue</p>
					<p className="text-2xl font-semibold text-zinc-100 tabular-nums">
						${liveData[liveData.length - 1]}k
					</p>
				</div>
				<Sparkline
					data={liveData}
					variant="area"
					color="#a78bfa"
					width={200}
					height={48}
					curved
					showTrend
					animate={false}
				/>
			</div>

			{/* Four variants preview */}
			<div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
				{(["line", "area", "bar", "dot"] as const).map((variant) => (
					<div
						key={variant}
						className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-center"
					>
						<Sparkline
							data={[3, 7, 4, 8, 2, 6, 5, 9, 3, 7]}
							variant={variant}
							color="#a78bfa"
							width={120}
							height={32}
							curved={variant === "line" || variant === "area"}
						/>
						<p className="mt-2 text-xs text-zinc-500">{variant}</p>
					</div>
				))}
			</div>
		</section>
	);
}
