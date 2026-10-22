<div align="center">

# EchoTwin AI

### Multilingual communication · Translation studio · Conversation history

A speech-to-speech translation interface with a translation studio, conversation mode, language selection, text-to-speech controls, and a local history vault.

</div>

<p align="center">
  <img src="public/img/hero.jpg" alt="EchoTwin AI featured artwork" width="78%" />
</p>

<p align="center">
  <strong>Product concept</strong> &nbsp;·&nbsp; <strong>Modular frontend</strong> &nbsp;·&nbsp; <strong>Developer-ready setup</strong>
</p>

---

## At a glance

| | Details |
|---|---|
| **Application** | EchoTwin AI |
| **Frontend** | React + TypeScript + Vite |
| **Styling / motion** | Tailwind CSS 4, custom CSS, Framer Motion where used |
| **Core experience** | Multilingual communication · Translation studio · Conversation history |
| **Run locally** | `npm install` → `npm run dev` |
| **Production build** | `npm run build` |

## Product visuals

<img src="public/img/hero.jpg" alt="Hero" width="31%" />
<img src="public/img/globe.jpg" alt="Globe" width="31%" />
<img src="public/img/mic.jpg" alt="Mic" width="31%" />

> **Visual note:** the gallery below uses original artwork shipped with the app, not fabricated browser screenshots. Add fresh full-page screenshots here after launching the app locally if you want a true UI gallery for a portfolio or GitHub showcase.

## What it does

- Translation studio with language selection
- Conversation-oriented interaction mode
- Text-to-speech playback controls
- Speech capture helpers
- Local translation/history vault
- Responsive React interface and reusable UI components

## Technology stack

`React 19` · `TypeScript` · `Vite 7` · `Tailwind CSS 4` · `Framer Motion` · `Lucide React` · `Browser Speech APIs` · `Local storage/data helpers`

The exact responsibilities of optional services and browser APIs are described below. This README documents the code included in this repository; it does not imply that third-party AI credentials, hosted model endpoints, or cloud services have been configured.

## Architecture

![EchoTwin AI system architecture](docs/architecture.svg)

### Request and data flow

```text
Source text / speech → language selection → translation engine
                                      ↓
                         translated text → speech playback
                                      ↓
                           conversation / history vault
```

### Component / repository map

```text
src/
├── pages/          # Home, studio, conversation, history vault
├── components/     # Navigation, language selector, UI, footer
├── lib/            # Engine, language definitions, speech capture, data
├── App.tsx         # Routes and app shell
└── index.css       # Global styles
public/img/         # Globe, microphone and hero artwork
vite.config.ts      # Vite configuration
```

## Getting started

### Prerequisites

- **Node.js:** use Node.js 22 LTS for the most consistent Vite/TypeScript toolchain. Check the `engines` field in `package.json` for the project-specific minimum.
- **npm:** included with Node.js.
- **Python:** required only for the optional Python helper/analysis path where noted below.
- A modern browser. Microphone-dependent features require permission and work best in a secure context (`localhost` is generally allowed).

### Install and launch

Run commands from the project root (folder containing `package.json`).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). For a production build and local preview:

```bash
npm run build
npm run preview
```

### Build and quality checks

Run the checks supported by this project's `package.json`:

```bash
npm run lint
npm run build
```

A successful development-server start is not the same as a successful production build. Resolve any TypeScript, lint, or build output before deploying.

## Optional services and integrations

This package is a frontend-first application; its speech and translation experience is implemented through the client-side engine and browser capabilities. Review `src/lib/engine.ts`, `src/lib/languages.ts`, and `src/lib/useSpeechCapture.ts` to see the current behavior and supported integrations.

## Configuration

- Review `package.json` for the scripts actually provided by this project.
- Review `vite.config.ts` for local development and proxy configuration.
- Do not commit API keys, private recordings, personal transcripts, or local database files.
- If you add external AI or speech providers, place credentials in environment variables and document required variable names in an `.env.example` file. Never publish real secrets in the README or source control.

## Deployment notes

1. Install dependencies using the supported Node.js version.
2. Run `npm run build` and make sure it finishes successfully.
3. Deploy the generated `dist/` directory to a static host that supports SPA fallback routing if client-side routes are used.
4. If you enable a separate API, deploy it independently and configure the frontend/API base URL and CORS policy for the production origin.
5. Keep optional backend services, database migrations, and model dependencies aligned with the deployment environment.

## Limitations and responsible use

Speech capture, voice playback, and language support depend on browser capabilities and device settings. Translation quality depends on the configured engine; do not assume a hosted AI translation provider is connected unless it has been explicitly configured.

## Troubleshooting

| Symptom | What to check |
|---|---|
| `npm` or `node` is not recognized | Install Node.js, restart the terminal, then run `node -v` and `npm -v`. |
| Dependency or TypeScript errors | Run `npm install` in the folder containing this README's `package.json`; then retry `npm run build`. |
| Port already in use | Stop the other process or use the port option supported by the relevant script. |
| Microphone permission denied | Allow microphone access in the browser and check the operating-system input device. |
| Optional API does not respond | Start its server in a second terminal and confirm its configured port and proxy. |
| Analysis results look like demo output | Check which local services/models are installed and enabled; the frontend alone does not guarantee hosted AI inference. |

## Project status

This repository is a development project. Verify the production build and the behavior of optional integrations in your own environment before presenting it as a production service. See the source files linked in the repository tree to trace each feature to its implementation.

---

<div align="center">

**EchoTwin AI** · Built with React, TypeScript, and a focus on clear product workflows.

</div>
