# SpeakLab AI English Speaking Coach

SpeakLab is an AI English speaking practice platform with a warm cartoon clay "Living Language Space" landing experience. The entry scene uses a cozy clay-yellow world, tiny flowers and grass across the screen, floating English words, an iOS-style glass cursor field, soft word dissolution, and a gentle transition into the speaking coach.

## Features

- Warm cartoon-clay interactive landing page with a cozy handmade texture.
- Tiny flowers, grass sprouts, leaves, and plant details distributed across the full screen.
- White English words floating slowly across the full page with soft appear, drift, and fade cycles.
- Cursor-aligned frosted glass circle that uses the exact pointer coordinates and dissolves only nearby words.
- Center glassmorphism card labeled `Start Communicating` with a soft magical transition into the speaking app.
- English speaking coach with scenario selection, microphone input, speech synthesis, scoring, AI expression corrections, and live feedback.
- Server-side AI feedback API for grammar correction, natural rewrites, next coach questions, and post-session summaries, with local rule feedback as a fallback.
- Legacy static prototype remains available in `legacy-static/` for fallback demos.

## Product Analysis and Design Thinking

- [AI 英语口语训练竞品分析报告](docs/competitive-analysis.md)

## Local Run

Install dependencies and start the Next.js app:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

The microphone feature works best in Chrome or Edge with microphone permission enabled.

## AI Feedback Configuration

SpeakLab uses a server-side API route at `/api/feedback` to request structured AI feedback. The API key is read only on the server and is never exposed to the browser.

Create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional. The app defaults to `gpt-4o-mini` for a low-cost demo-friendly setup. You can switch it to another compatible OpenAI model if needed.

Feedback flow:

1. The browser first creates an instant local rule-based score.
2. The app sends the answer, scenario, task requirements, and local score to `/api/feedback`.
3. The server returns structured AI feedback: scores, corrections, natural rewrite, next coach question, and post-session summary.
4. If the AI request fails or `OPENAI_API_KEY` is missing, the UI keeps the local rule feedback so the demo remains usable.

Legacy static prototype:

```bash
python -m http.server 8080 -d legacy-static
```

Then open `http://localhost:8080`.

## Tech Stack

- Next.js
- React
- Framer Motion
- CSS clay texture, plant shapes, floating word animations, and glassmorphism effects
- Browser Web Speech API for speech recognition and synthesis
- Server-side OpenAI-compatible Responses API call for structured AI feedback

## Original Work and Dependencies

The immersive landing page and speaking coach interaction are implemented in this repository. Third-party dependencies are listed in `package.json`. Browser Web Speech API is a runtime capability and is not bundled as a third-party package.

If future PRs add online LLMs, speech assessment APIs, or streaming voice services, the README and PR description should document the provider, SDK, model, cost, privacy considerations, and the original feature scope.

## PR Submission Guidance

Each PR should do one thing and include:

- Title: one sentence describing the change.
- Feature description: what the feature does and how to use it.
- Implementation notes: core technical choices or logic.
- Test method: commands or manual steps used to verify the change.

Suggested future PRs:

1. `feat: add session history dashboard`
2. `feat: add CEFR speaking rubric`
3. `feat: integrate streaming AI conversation`
4. `docs: add demo video link`

## Demo Video

Add the public demo video link here after uploading it to a playable external platform:

- Demo video: pending

Recommended demo flow: open the landing page, show the warm clay-yellow world, move the glass circle over floating words to dissolve them, click `Start Communicating`, select a speaking scenario, answer with microphone or text, view live feedback, and explain the scoring/correction results.
