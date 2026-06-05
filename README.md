# SpeakLab AI English Speaking Coach

SpeakLab is an AI English speaking practice platform with a cinematic "Living Language Space" landing experience. The entry scene uses clay-inspired materials, spatial floating English words, liquid-glass interaction, particle dissolution, bloom, depth of field, and film grain before transitioning into the speaking coach.

## Features

- Cinematic interactive landing page inspired by Apple Vision Pro and Liquid Glass.
- Hundreds of English words floating through depth space like thoughts and vocabulary.
- Frosted glass cursor field with word awareness, vibration, particle breakup, inward swirl, and light dissolve.
- Center portal card that collapses the language space into the speaking application.
- English speaking coach with scenario selection, microphone input, speech synthesis, scoring, expression corrections, and live feedback.
- Legacy static prototype remains available in `legacy-static/` for fallback demos.

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

Legacy static prototype:

```bash
python -m http.server 8080 -d legacy-static
```

Then open `http://localhost:8080`.

## Tech Stack

- Next.js
- React
- React Three Fiber
- Three.js
- Drei
- Framer Motion
- GLSL shader materials
- GPU-style point particles
- Post-processing bloom, depth of field, vignette, and film grain
- Browser Web Speech API for speech recognition and synthesis

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

Recommended demo flow: open the landing page, show floating words and cursor dissolution, click the portal, select a speaking scenario, answer with microphone or text, view live feedback, and explain the scoring/correction results.
