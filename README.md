# Module

Hausaufgaben, Übungen und Praktikumsaufgaben, nach Modulen geordnet. Gebaut mit [Astro](https://astro.build) und [Starlight](https://starlight.astro.build), Formeln mit KaTeX.

## Aufbau

Jeder Ordner unter `src/content/docs/` ist ein Modul. Der Titel in der Seitenleiste kommt aus dessen `index.mdx`. Ein Modul hat bis zu drei Bereiche:

- `ha.mdx` für die Hausaufgabenserie
- `uebung.mdx` für die Übungsserie
- `praktikum.mdx` für Praktikumsaufgaben

Ein neues Modul braucht nur einen neuen Ordner nach dem Muster von `beispielmodul/`.

## Lokal starten

```
bun install
bun run dev
```

Die Seite läuft dann unter http://localhost:4321.
