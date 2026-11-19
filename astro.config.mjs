// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { katex } from '@nullpinter/satteri-katex';

const DOCS = new URL('./src/content/docs/', import.meta.url);

/** Jeder Ordner in src/content/docs ist ein Modul; Titel aus dessen index.mdx. */
const moduleGroups = readdirSync(DOCS, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => {
		const index = new URL(`${d.name}/index.mdx`, DOCS);
		const title = existsSync(index)
			? readFileSync(index, 'utf8').match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '')
			: undefined;
		return { label: title ?? d.name, items: [{ autogenerate: { directory: d.name } }] };
	})
	.sort((a, b) => a.label.localeCompare(b.label, 'de'));

export default defineConfig({
	site: 'https://module.erikskopp.de',
	markdown: {
		processor: satteri({
			features: { math: true },
			mdastPlugins: [katex()],
		}),
	},
	integrations: [
		starlight({
			title: 'Module',
			defaultLocale: 'root',
			locales: { root: { label: 'Deutsch', lang: 'de' } },
			customCss: ['./src/styles/katex.css'],
			sidebar: moduleGroups,
		}),
	],
});
