import { Features } from "./sections/Features";
import { Hero } from "./sections/Hero";
import { Theming } from "./sections/Theming";
import { UseCases } from "./sections/UseCases";
import { Variants } from "./sections/Variants";

export function App() {
	return (
		<div className="min-h-screen">
			<div className="max-w-5xl mx-auto px-6">
				<Hero />

				<hr className="border-zinc-800" />
				<Variants />

				<hr className="border-zinc-800" />
				<Features />

				<hr className="border-zinc-800" />
				<UseCases />

				<hr className="border-zinc-800" />
				<Theming />

				<hr className="border-zinc-800" />

				<footer className="py-16 text-center">
					<p className="text-sm text-zinc-500 mb-4">Install</p>
					<code className="inline-block px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm">
						npm install react-tiny-sparkline
					</code>
					<div className="mt-8 flex justify-center gap-6 text-sm text-zinc-500">
						<a
							href="https://github.com/mulkatz/react-tiny-sparkline"
							className="hover:text-zinc-300 transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://npmjs.com/package/react-tiny-sparkline"
							className="hover:text-zinc-300 transition-colors"
						>
							npm
						</a>
						<span className="text-zinc-700">&lt;2KB gzipped</span>
					</div>
					<p className="mt-8 text-xs text-zinc-600">MIT License</p>
				</footer>
			</div>
		</div>
	);
}
