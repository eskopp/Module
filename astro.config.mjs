// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { katex } from '@nullpinter/satteri-katex';

const DOCS = new URL('./src/content/docs/', import.meta.url);

/** Liest `title:` aus der index.mdx eines Ordners. */
const titleOf = (dir) => {
	const index = new URL(`${dir}/index.mdx`, DOCS);
	if (!existsSync(index)) return undefined;
	return readFileSync(index, 'utf8')
		.match(/^title:\s*(.+)$/m)?.[1]
		?.replace(/^['"]|['"]$/g, '');
};

const subdirs = (dir) =>
	readdirSync(new URL(`${dir}/`, DOCS), { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

/** Jeder Ordner in src/content/docs ist ein Modul, jeder Unterordner (ha, uebung, praktikum) eine Serie. */
const moduleGroups = readdirSync(DOCS, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => ({
		label: titleOf(d.name) ?? d.name,
		items: [
			{ label: 'Übersicht', slug: d.name },
			...subdirs(d.name).map((sd) => ({
				label: titleOf(`${d.name}/${sd}`) ?? sd,
				collapsed: true,
				items: [{ autogenerate: { directory: `${d.name}/${sd}` } }],
			})),
		],
	}))
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
