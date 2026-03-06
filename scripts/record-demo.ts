import { type ChildProcess, spawn } from "node:child_process";
import { type Page, chromium } from "playwright";

const WIDTH = 800;
const HEIGHT = 600;
const DEV_URL = "http://localhost:5173";

async function waitForServer(url: string, timeout = 15000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not ready yet
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function startDevServer(): Promise<ChildProcess> {
	const proc = spawn("npm", ["run", "dev"], {
		cwd: new URL("../demo", import.meta.url).pathname,
		stdio: "pipe",
	});
	await waitForServer(DEV_URL);
	return proc;
}

async function wait(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function smoothMove(
	page: Page,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	steps = 20,
	stepDelay = 30,
) {
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		const x = startX + (endX - startX) * ease;
		const y = startY + (endY - startY) * ease;
		await page.mouse.move(x, y);
		await wait(stepDelay);
	}
}

async function record() {
	console.log("Starting demo dev server...");
	const server = await startDevServer();

	try {
		console.log("Launching browser...");
		const browser = await chromium.launch();
		const context = await browser.newContext({
			viewport: { width: WIDTH, height: HEIGHT },
			recordVideo: {
				dir: "./tmp-video",
				size: { width: WIDTH, height: HEIGHT },
			},
		});

		const page = await context.newPage();
		await page.goto(DEV_URL);
		await wait(1500);

		// === Hero section: Show live sparkline updating ===
		await wait(2500);

		// === Scroll to Variants and click through them ===
		await page.evaluate(() => {
			document.querySelector("h2")?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(800);

		// Click Area variant
		const areaBtn = page.locator("button", { hasText: "Area" }).first();
		await areaBtn.click();
		await wait(600);

		// Click Bar variant
		const barBtn = page.locator("button", { hasText: "Bar" }).first();
		await barBtn.click();
		await wait(600);

		// Click Dot variant
		const dotBtn = page.locator("button", { hasText: "Dot" }).first();
		await dotBtn.click();
		await wait(600);

		// Back to Line
		const lineBtn = page.locator("button", { hasText: "Line" }).first();
		await lineBtn.click();
		await wait(400);

		// Toggle curved
		const curvedCheckbox = page.locator('input[type="checkbox"]').first();
		await curvedCheckbox.click();
		await wait(800);

		// === Scroll to Features ===
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[1]?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(800);

		// Hover over the feature chart to show tooltip
		const featureChart = page.locator('svg[role="img"]').nth(6);
		const box = await featureChart.boundingBox();
		if (box) {
			await smoothMove(
				page,
				box.x,
				box.y + box.height / 2,
				box.x + box.width,
				box.y + box.height / 2,
				30,
				40,
			);
		}
		await wait(600);

		// === Scroll to Use Cases ===
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[2]?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(1500);

		// === Scroll to Theming ===
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[3]?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(600);

		// Click through themes
		for (const theme of ["Emerald", "Rose", "Sky", "Violet"]) {
			const btn = page.locator("button", { hasText: theme }).first();
			await btn.click();
			await wait(500);
		}

		await wait(800);

		console.log("Recording complete. Saving video...");
		await context.close();
		await browser.close();

		console.log("Video saved to tmp-video/");
	} finally {
		server.kill();
	}
}

record().catch((err) => {
	console.error("Recording failed:", err);
	process.exit(1);
});
