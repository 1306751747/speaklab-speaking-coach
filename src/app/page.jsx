"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const languageWords = [
  "hello", "listen", "speak", "story", "voice", "friend", "meaning", "answer",
  "question", "practice", "grammar", "memory", "dream", "talk", "coffee", "travel",
  "meeting", "interview", "order", "smile", "confidence", "rhythm", "phrase", "idea",
  "sunny", "gentle", "curious", "reply", "share", "learn", "daily", "clear", "warm",
  "native", "fluent", "simple", "bright", "express", "connect", "language", "moment"
];

const scenarios = [
  {
    id: "interview",
    label: "Interview",
    prompt: "Tell me about one project you are proud of. What was your role?",
    goal: "Structure confident answers with role, impact, and reflection."
  },
  {
    id: "restaurant",
    label: "Ordering",
    prompt: "Welcome. Would you like to hear today's specials?",
    goal: "Practice preferences, allergies, questions, and confirmation."
  },
  {
    id: "meeting",
    label: "Meeting",
    prompt: "Let's start with your progress update. What has changed since last week?",
    goal: "Give concise updates, blockers, proposals, and action items."
  }
];

const random = (seed) => {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
};

function createWord(index, cycle = 0) {
  const seed = index * 31 + cycle * 97 + 11;
  return {
    id: `${index}-${cycle}`,
    text: languageWords[index % languageWords.length],
    left: 4 + random(seed) * 92,
    top: 5 + random(seed + 1) * 88,
    size: 13 + random(seed + 2) * 26,
    weight: random(seed + 3) > 0.72 ? 700 : 500,
    duration: 11 + random(seed + 4) * 13,
    delay: -random(seed + 5) * 12,
    driftX: -28 + random(seed + 6) * 56,
    driftY: -22 + random(seed + 7) * 44,
    cycle
  };
}

function createPlant(index) {
  const seed = index * 19 + 5;
  const types = ["flower", "sprout", "leaf", "grass", "dot"];
  return {
    id: index,
    type: types[index % types.length],
    left: random(seed) * 100,
    top: random(seed + 1) * 100,
    scale: 0.65 + random(seed + 2) * 0.95,
    rotate: -35 + random(seed + 3) * 70,
    tone: index % 4
  };
}

function createClayMark(index) {
  const seed = index * 23 + 17;
  const types = ["dent", "press", "crack", "ridge", "speck"];
  return {
    id: index,
    type: types[index % types.length],
    left: random(seed) * 100,
    top: random(seed + 1) * 100,
    width: 10 + random(seed + 2) * 42,
    height: 5 + random(seed + 3) * 24,
    rotate: -34 + random(seed + 4) * 68,
    opacity: 0.28 + random(seed + 5) * 0.34
  };
}

function ClayMaterialCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      let seed = 42;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#f5cf77");
      base.addColorStop(0.32, "#edbd5f");
      base.addColorStop(0.68, "#e3ad53");
      base.addColorStop(1, "#dca04e");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const castLight = ctx.createRadialGradient(width * 0.22, height * 0.12, 0, width * 0.22, height * 0.12, width * 0.72);
      castLight.addColorStop(0, "rgba(255, 244, 196, 0.5)");
      castLight.addColorStop(0.48, "rgba(255, 224, 143, 0.16)");
      castLight.addColorStop(1, "rgba(150, 86, 34, 0)");
      ctx.fillStyle = castLight;
      ctx.fillRect(0, 0, width, height);

      const lowerShadow = ctx.createRadialGradient(width * 0.76, height * 0.9, 0, width * 0.76, height * 0.9, width * 0.7);
      lowerShadow.addColorStop(0, "rgba(111, 65, 25, 0.18)");
      lowerShadow.addColorStop(0.6, "rgba(141, 82, 32, 0.08)");
      lowerShadow.addColorStop(1, "rgba(111, 65, 25, 0)");
      ctx.fillStyle = lowerShadow;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "soft-light";
      for (let i = 0; i < 70; i += 1) {
        const x = rand() * width;
        const y = rand() * height;
        const rx = 80 + rand() * 260;
        const ry = 34 + rand() * 150;
        const angle = rand() * Math.PI;
        const warm = rand() > 0.46;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        gradient.addColorStop(0, warm ? "rgba(255, 239, 180, 0.28)" : "rgba(118, 70, 27, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < 145; i += 1) {
        const x = rand() * width;
        const y = rand() * height;
        const rx = 10 + rand() * 58;
        const ry = 5 + rand() * 28;
        const angle = rand() * Math.PI;
        const dent = rand() > 0.36;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.shadowBlur = 5 + rand() * 9;
        ctx.shadowColor = dent ? "rgba(91, 54, 22, 0.18)" : "rgba(255, 239, 185, 0.22)";
        const gradient = ctx.createRadialGradient(-rx * 0.26, -ry * 0.32, 0, 0, 0, rx);
        if (dent) {
          gradient.addColorStop(0, "rgba(92, 55, 22, 0.22)");
          gradient.addColorStop(0.46, "rgba(155, 91, 36, 0.09)");
          gradient.addColorStop(0.72, "rgba(255, 232, 164, 0.16)");
          gradient.addColorStop(1, "rgba(255, 232, 164, 0)");
        } else {
          gradient.addColorStop(0, "rgba(255, 241, 193, 0.26)");
          gradient.addColorStop(0.58, "rgba(232, 174, 88, 0.08)");
          gradient.addColorStop(1, "rgba(92, 55, 22, 0)");
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < 118; i += 1) {
        const x = rand() * width;
        const y = rand() * height;
        const length = 18 + rand() * 96;
        const waviness = 4 + rand() * 16;
        const angle = -0.65 + rand() * 1.3;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.lineCap = "round";
        ctx.lineWidth = 0.7 + rand() * 1.25;
        ctx.strokeStyle = rand() > 0.52 ? "rgba(90, 54, 22, 0.18)" : "rgba(255, 239, 188, 0.22)";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(93, 57, 24, 0.08)";
        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.bezierCurveTo(-length * 0.18, -waviness, length * 0.18, waviness, length / 2, (rand() - 0.5) * waviness);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < 44; i += 1) {
        const x = rand() * width;
        const y = rand() * height;
        const length = 24 + rand() * 86;
        const angle = rand() * Math.PI;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(79, 47, 19, 0.2)";
        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        for (let step = 0; step < 4; step += 1) {
          ctx.lineTo(-length / 2 + (length * (step + 1)) / 4, (rand() - 0.5) * 10);
        }
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 238, 180, 0.16)";
        ctx.translate(0, -1.3);
        ctx.stroke();
        ctx.restore();
      }

      const grainCanvas = document.createElement("canvas");
      const grainSize = 180;
      grainCanvas.width = grainSize;
      grainCanvas.height = grainSize;
      const grainCtx = grainCanvas.getContext("2d");
      const image = grainCtx.createImageData(grainSize, grainSize);
      for (let i = 0; i < image.data.length; i += 4) {
        const n = rand();
        const alpha = n > 0.52 ? Math.floor(18 + n * 34) : Math.floor(4 + n * 14);
        const dark = n > 0.68;
        image.data[i] = dark ? 90 : 255;
        image.data[i + 1] = dark ? 58 : 235;
        image.data[i + 2] = dark ? 24 : 176;
        image.data[i + 3] = alpha;
      }
      grainCtx.putImageData(image, 0, 0);
      ctx.globalAlpha = 0.32;
      ctx.globalCompositeOperation = "multiply";
      const pattern = ctx.createPattern(grainCanvas, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return <canvas className="clay-material-canvas" ref={canvasRef} aria-hidden="true" />;
}

function ClayRelief() {
  const marks = useMemo(() => Array.from({ length: 118 }, (_, index) => createClayMark(index)), []);
  return (
    <div className="clay-relief" aria-hidden="true">
      {marks.map((mark) => (
        <span
          key={mark.id}
          className={`clay-mark clay-${mark.type}`}
          style={{
            left: `${mark.left}%`,
            top: `${mark.top}%`,
            width: `${mark.width}px`,
            height: `${mark.height}px`,
            opacity: mark.opacity,
            "--mark-rotate": `${mark.rotate}deg`
          }}
        />
      ))}
    </div>
  );
}

function DecorativePlants({ hidden }) {
  const plants = useMemo(() => Array.from({ length: 165 }, (_, index) => createPlant(index)), []);
  return (
    <motion.div
      className="plant-field"
      aria-hidden="true"
      animate={{ opacity: hidden ? 0.16 : 1, scale: hidden ? 0.96 : 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {plants.map((plant) => (
        <span
          key={plant.id}
          className={`plant plant-${plant.type} tone-${plant.tone}`}
          style={{
            left: `${plant.left}%`,
            top: `${plant.top}%`,
            "--plant-scale": plant.scale,
            "--plant-rotate": `${plant.rotate}deg`
          }}
        >
          {plant.type === "flower" && (
            <>
              <i />
              <b />
            </>
          )}
          {plant.type === "sprout" && (
            <>
              <i />
              <b />
            </>
          )}
          {plant.type === "leaf" && <i />}
          {plant.type === "grass" && (
            <>
              <i />
              <b />
              <em />
            </>
          )}
        </span>
      ))}
    </motion.div>
  );
}

function FloatingWords({ cursor, phase }) {
  const radius = 82;
  const [wordItems, setWordItems] = useState(() => Array.from({ length: 135 }, (_, index) => createWord(index)));
  const [dissolving, setDissolving] = useState(() => new Set());

  useEffect(() => {
    if (phase !== "idle") return undefined;

    const checkWords = () => {
      if (!cursor.current.active) return;
      setDissolving((current) => {
        const next = new Set(current);
        let changed = false;
        for (const item of wordItems) {
          if (next.has(item.id)) continue;
          const x = (item.left / 100) * window.innerWidth;
          const y = (item.top / 100) * window.innerHeight;
          const distance = Math.hypot(x - cursor.current.x, y - cursor.current.y);
          if (distance < radius) {
            next.add(item.id);
            changed = true;
            window.setTimeout(() => {
              setWordItems((items) =>
                items.map((word) =>
                  word.id === item.id ? createWord(Number(item.id.split("-")[0]), item.cycle + 1) : word
                )
              );
              setDissolving((items) => {
                const copy = new Set(items);
                copy.delete(item.id);
                return copy;
              });
            }, 920);
          }
        }
        return changed ? next : current;
      });
    };

    const interval = window.setInterval(checkWords, 80);
    return () => window.clearInterval(interval);
  }, [cursor, phase, wordItems]);

  return (
    <div className="word-field" aria-hidden="true">
      {wordItems.map((item) => (
        <motion.span
          key={item.id}
          className={`floating-word ${dissolving.has(item.id) ? "dissolving" : ""}`}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            fontWeight: item.weight,
            "--drift-x": `${item.driftX}px`,
            "--drift-y": `${item.driftY}px`,
            "--word-duration": `${item.duration}s`,
            "--word-delay": `${item.delay}s`
          }}
          animate={
            phase === "collapse"
              ? {
                  left: "50%",
                  top: "50%",
                  opacity: 0,
                  scale: 0.35,
                  filter: "blur(10px)"
                }
              : undefined
          }
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.text}
          <small />
        </motion.span>
      ))}
    </div>
  );
}

function CursorGlass({ cursor, phase }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  useEffect(() => {
    const handleMove = (event) => {
      cursor.current = { x: event.clientX, y: event.clientY, active: true };
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursor, x, y]);

  return (
    <motion.div
      className="cursor-glass"
      style={{ left: x, top: y }}
      animate={{
        opacity: phase === "collapse" ? 0 : 1,
        scale: phase === "collapse" ? 0.42 : 1
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function EntryCard({ phase, onEnter }) {
  return (
    <motion.button
      type="button"
      className="communication-card"
      disabled={phase !== "idle"}
      onClick={onEnter}
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      animate={{
        opacity: phase === "collapse" ? 0 : 1,
        y: phase === "collapse" ? -8 : 0,
        scale: phase === "collapse" ? 1.12 : 1
      }}
      whileHover={phase === "idle" ? { scale: 1.045 } : undefined}
      transition={{ type: "spring", stiffness: 150, damping: 19 }}
    >
      <span className="card-kicker">SpeakLab</span>
      <strong aria-label="Start Communicating">
        <span>Start</span>
        <span>Communicating</span>
      </strong>
      <em>soft practice for real English moments</em>
    </motion.button>
  );
}

function WarmLanding({ onComplete }) {
  const cursor = useRef({ x: -200, y: -200, active: false });
  const [phase, setPhase] = useState("idle");

  const enter = () => {
    setPhase("collapse");
    window.setTimeout(onComplete, 1550);
  };

  return (
    <motion.section
      className="warm-landing"
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <ClayMaterialCanvas />
      <div className="clay-grain" aria-hidden="true" />
      <ClayRelief />
      <DecorativePlants hidden={phase === "collapse"} />
      <FloatingWords cursor={cursor} phase={phase} />
      <EntryCard phase={phase} onEnter={enter} />
      <CursorGlass cursor={cursor} phase={phase} />
      <motion.div
        className="warm-collapse"
        aria-hidden="true"
        animate={{
          opacity: phase === "collapse" ? [0, 0.85, 0] : 0,
          scale: phase === "collapse" ? [0.15, 1, 2.6] : 0.15
        }}
        transition={{ duration: 1.45, times: [0, 0.46, 1], ease: "easeInOut" }}
      />
    </motion.section>
  );
}

function SpeakingApp() {
  const SpeechRecognition =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const [scenario, setScenario] = useState(scenarios[0]);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let text = "";
      for (const result of event.results) text += result[0].transcript;
      setDraft(text.trim());
    };
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [SpeechRecognition]);

  const submit = () => {
    if (!draft.trim()) return;
    const analysis = analyzeSpeech(draft, scenario.id);
    setTurns((current) => [{ text: draft.trim(), analysis }, ...current].slice(0, 6));
    setDraft("");
    const utterance = new SpeechSynthesisUtterance(nextCoachLine(scenario.id, turns.length + 1));
    utterance.lang = "en-US";
    utterance.rate = 0.93;
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <div>
          <p>SpeakLab Conversation Coach</p>
          <h1>Practice real English conversations in a gentle language garden.</h1>
        </div>
        <div className="scenario-tabs">
          {scenarios.map((item) => (
            <button
              key={item.id}
              className={item.id === scenario.id ? "active" : ""}
              type="button"
              onClick={() => setScenario(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="coach-grid">
        <div className="coach-panel dialogue-panel">
          <span>Coach Prompt</span>
          <h2>{scenario.prompt}</h2>
          <p>{scenario.goal}</p>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Speak with the microphone or type your answer here."
          />
          <div className="coach-actions">
            <button type="button" onClick={() => recognitionRef.current?.start()} disabled={!SpeechRecognition || listening}>
              {listening ? "Listening..." : "Microphone"}
            </button>
            <button type="button" onClick={submit}>
              Send Answer
            </button>
          </div>
        </div>

        <div className="coach-panel score-panel-next">
          <span>Live Feedback</span>
          <ScoreDashboard latest={turns[0]?.analysis} />
          <CorrectionList latest={turns[0]?.analysis} />
        </div>
      </section>
    </main>
  );
}

function ScoreDashboard({ latest }) {
  const score = latest || { overall: "--", fluency: "--", grammar: "--", relevance: "--" };
  return (
    <div className="score-dashboard">
      <strong>{score.overall}</strong>
      <div>
        <p>Fluency <span>{score.fluency}</span></p>
        <p>Grammar <span>{score.grammar}</span></p>
        <p>Context <span>{score.relevance}</span></p>
      </div>
    </div>
  );
}

function CorrectionList({ latest }) {
  const items = latest?.corrections?.length ? latest.corrections : ["Complete one answer to receive expression feedback."];
  return (
    <div className="correction-stack">
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}

function analyzeSpeech(text, scenarioId) {
  const wordsInAnswer = text.match(/[A-Za-z']+/g) || [];
  const lower = text.toLowerCase();
  const fillers = (lower.match(/\b(um|uh|like|you know|basically)\b/g) || []).length;
  const corrections = [];
  if (/\bi am agree\b/i.test(text)) corrections.push("Use 'I agree' instead of 'I am agree'.");
  if (/\bdiscuss about\b/i.test(text)) corrections.push("Use 'discuss the topic' instead of 'discuss about'.");
  if (wordsInAnswer.length < 10) corrections.push("Add one reason and one example to sound more natural.");
  if (!/[.!?]$/.test(text.trim())) corrections.push("Finish with a clear sentence ending and pause.");
  const keywords = {
    interview: ["project", "role", "impact", "team", "challenge"],
    restaurant: ["order", "recommend", "allergy", "drink", "confirm"],
    meeting: ["progress", "blocker", "timeline", "action", "owner"]
  }[scenarioId];
  const relevanceHits = keywords.filter((keyword) => lower.includes(keyword)).length;
  const fluency = clamp(86 - fillers * 7 + Math.min(wordsInAnswer.length, 35) * 0.25, 45, 98);
  const grammar = clamp(92 - corrections.length * 8, 42, 98);
  const relevance = clamp(56 + relevanceHits * 12 + Math.min(wordsInAnswer.length, 24) * 0.5, 42, 98);
  return {
    fluency: Math.round(fluency),
    grammar: Math.round(grammar),
    relevance: Math.round(relevance),
    overall: Math.round((fluency + grammar + relevance) / 3),
    corrections
  };
}

function nextCoachLine(scenarioId, count) {
  const lines = {
    interview: ["Could you make that more specific?", "What did you learn from that experience?", "How would you summarize your strengths?"],
    restaurant: ["Would you like to confirm the order?", "Do you have any dietary needs?", "Could you ask for a recommendation?"],
    meeting: ["What is the next action item?", "Who should own that task?", "How should the timeline change?"]
  };
  return lines[scenarioId][count % lines[scenarioId].length];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Page() {
  const [entered, setEntered] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <WarmLanding key="landing" onComplete={() => setEntered(true)} />
      ) : (
        <motion.div key="app" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }}>
          <SpeakingApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
