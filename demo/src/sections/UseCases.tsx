import { Sparkline } from "react-tiny-sparkline";

const metrics = [
	{
		label: "Revenue",
		value: "$42.8k",
		change: "+12.5%",
		positive: true,
		data: [18, 22, 15, 28, 25, 32, 30, 35, 28, 38, 35, 42],
	},
	{
		label: "Users",
		value: "2,847",
		change: "+8.2%",
		positive: true,
		data: [120, 135, 128, 142, 155, 148, 165, 172, 168, 185, 195, 210],
	},
	{
		label: "Bounce Rate",
		value: "32.1%",
		change: "-4.3%",
		positive: true,
		data: [45, 42, 48, 40, 38, 42, 36, 35, 38, 34, 33, 32],
	},
	{
		label: "Latency",
		value: "142ms",
		change: "+18ms",
		positive: false,
		data: [120, 118, 125, 130, 128, 135, 132, 138, 140, 135, 140, 142],
	},
];

const tableRows = [
	{ name: "Homepage", views: "12,482", data: [80, 95, 88, 102, 98, 110, 105] },
	{ name: "Pricing", views: "4,291", data: [30, 42, 38, 45, 52, 48, 55] },
	{ name: "Blog", views: "8,103", data: [60, 55, 65, 58, 70, 62, 68] },
	{ name: "Docs", views: "6,720", data: [50, 48, 55, 52, 58, 60, 56] },
	{ name: "API", views: "3,194", data: [25, 30, 28, 35, 32, 38, 35] },
];

export function UseCases() {
	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-100 mb-2">Use Cases</h2>
			<p className="text-zinc-400 mb-10">
				Dashboard cards and table inline charts — the two most common patterns.
			</p>

			{/* Dashboard cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
				{metrics.map((m) => (
					<div
						key={m.label}
						className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
					>
						<p className="text-xs text-zinc-500 mb-1">{m.label}</p>
						<div className="flex items-end justify-between gap-2">
							<div>
								<p className="text-lg font-semibold text-zinc-100 tabular-nums">
									{m.value}
								</p>
								<p
									className={`text-xs tabular-nums ${m.positive ? "text-emerald-400" : "text-red-400"}`}
								>
									{m.change}
								</p>
							</div>
							<Sparkline
								data={m.data}
								variant="area"
								color={m.positive ? "#4ade80" : "#f87171"}
								width={80}
								height={28}
								curved
								animate={false}
							/>
						</div>
					</div>
				))}
			</div>

			{/* Table with inline sparklines */}
			<div className="rounded-xl border border-zinc-800 overflow-hidden">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-zinc-800 bg-zinc-900/50">
							<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
								Page
							</th>
							<th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
								Views
							</th>
							<th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
								7-day trend
							</th>
						</tr>
					</thead>
					<tbody>
						{tableRows.map((row) => (
							<tr
								key={row.name}
								className="border-b border-zinc-800/50 last:border-0"
							>
								<td className="px-4 py-3 text-zinc-200">{row.name}</td>
								<td className="px-4 py-3 text-right text-zinc-400 tabular-nums">
									{row.views}
								</td>
								<td className="px-4 py-3 text-right">
									<span className="inline-block">
										<Sparkline
											data={row.data}
											variant="bar"
											color="#a78bfa"
											width={64}
											height={20}
											animate={false}
										/>
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
