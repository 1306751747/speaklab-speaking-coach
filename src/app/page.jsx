"use client";

import { motion, useMotionValue } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";

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

const PlantItems = memo(function PlantItems({ plants }) {
  return plants.map((plant) => (
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
  ));
});

const WordItems = memo(function WordItems({ wordItems, dissolving }) {
  return wordItems.map((item) => (
    <span
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
    >
      {item.text}
      <small />
    </span>
  ));
});

function DecorativePlants({ hidden }) {
  const plants = useMemo(() => Array.from({ length: 165 }, (_, index) => createPlant(index)), []);
  return (
    <div
      className={`plant-field ${hidden ? "fading" : ""}`}
      aria-hidden="true"
    >
      <PlantItems plants={plants} />
    </div>
  );
}

function FloatingWords({ cursor, phase }) {
  const radius = 82;
  const timeoutIds = useRef(new Set());
  const [wordItems, setWordItems] = useState(() => Array.from({ length: 135 }, (_, index) => createWord(index)));
  const [dissolving, setDissolving] = useState(() => new Set());

  useEffect(() => {
    if (phase !== "idle") {
      timeoutIds.current.forEach((id) => window.clearTimeout(id));
      timeoutIds.current.clear();
      setDissolving((current) => (current.size ? new Set() : current));
      return undefined;
    }

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
            const timeoutId = window.setTimeout(() => {
              timeoutIds.current.delete(timeoutId);
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
            timeoutIds.current.add(timeoutId);
          }
        }
        return changed ? next : current;
      });
    };

    const interval = window.setInterval(checkWords, 80);
    return () => window.clearInterval(interval);
  }, [cursor, phase, wordItems]);

  return (
    <div className={`word-field ${phase === "collapse" ? "collapsing" : ""}`} aria-hidden="true">
      <WordItems wordItems={wordItems} dissolving={dissolving} />
    </div>
  );
}

function CursorGlass({ cursor, phase }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  useEffect(() => {
    if (phase !== "idle") {
      cursor.current = { ...cursor.current, active: false };
      return undefined;
    }

    const handleMove = (event) => {
      cursor.current = { x: event.clientX, y: event.clientY, active: true };
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursor, phase, x, y]);

  return (
    <motion.div
      className={`cursor-glass ${phase !== "idle" ? "collapsing" : ""}`}
      style={{ left: x, top: y }}
    />
  );
}

function EntryCard({ phase, onEnter }) {
  return (
    <button
      type="button"
      className={`communication-card ${phase === "collapse" ? "collapsing" : ""}`}
      disabled={phase !== "idle"}
      onClick={onEnter}
    >
      <span className="card-kicker">SpeakLab</span>
      <strong aria-label="Start Communicating">
        <span>Start</span>
        <span>Communicating</span>
      </strong>
      <em>soft practice for real English moments</em>
    </button>
  );
}

function WarmLanding({ onBegin, onComplete }) {
  const cursor = useRef({ x: -200, y: -200, active: false });
  const [phase, setPhase] = useState("idle");

  const enter = () => {
    setPhase("collapse");
    onBegin?.();
    window.setTimeout(onComplete, 500);
  };

  return (
    <section className={`warm-landing ${phase === "collapse" ? "collapsing" : ""}`}>
      <DecorativePlants hidden={phase === "collapse"} />
      <FloatingWords cursor={cursor} phase={phase} />
      <EntryCard phase={phase} onEnter={enter} />
      <CursorGlass cursor={cursor} phase={phase} />
      <div className={`warm-collapse ${phase === "collapse" ? "active" : ""}`} aria-hidden="true" />
    </section>
  );
}

function SpeakingApp({ active = true }) {
  const SpeechRecognition =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const [scenario, setScenario] = useState(scenarios[0]);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
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
    return () => recognition.abort?.();
  }, [SpeechRecognition, active]);

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
  const [appMounted, setAppMounted] = useState(false);
  const [landingVisible, setLandingVisible] = useState(true);

  useEffect(() => {
    let mounted = false;
    const mountApp = () => {
      if (mounted) return;
      mounted = true;
      setAppMounted(true);
    };
    const fallbackId = window.setTimeout(mountApp, 240);
    let idleId;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mountApp, { timeout: 180 });
    }
    return () => {
      window.clearTimeout(fallbackId);
      if (idleId) window.cancelIdleCallback?.(idleId);
    };
  }, []);

  const prepareApp = () => {
    setAppMounted(true);
    window.setTimeout(() => setEntered(true), 100);
  };

  return (
    <div className="page-stage">
      {(appMounted || entered) && (
        <div
          className={`app-transition-layer ${entered ? "active" : ""} ${!landingVisible ? "settled" : ""}`}
          aria-hidden={!entered}
        >
          <SpeakingApp active={entered} />
        </div>
      )}
      {landingVisible && <WarmLanding onBegin={prepareApp} onComplete={() => setLandingVisible(false)} />}
    </div>
  );
}
