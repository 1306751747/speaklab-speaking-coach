"use client";

import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Text, shaderMaterial } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

const words = [
  "clarity", "voice", "meaning", "memory", "phrase", "listen", "answer", "story", "accent",
  "rhythm", "grammar", "intent", "confidence", "fluency", "dialogue", "recall", "practice",
  "presence", "expression", "question", "thought", "vocabulary", "speak", "imagine",
  "respond", "understand", "shadow", "tone", "breath", "sentence", "context", "interview",
  "meeting", "order", "travel", "reflect", "revise", "progress", "native", "coach"
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

const ClayMaterial = shaderMaterial(
  { time: 0 },
  `
    varying vec2 vUv;
    varying float vLift;
    uniform float time;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    void main() {
      vUv = uv;
      vec3 pos = position;
      float n = noise(uv * 18.0 + time * 0.018);
      pos.z += n * 0.1;
      vLift = n;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    varying float vLift;
    uniform float time;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 21845.731);
    }
    void main() {
      vec3 terracotta = vec3(0.33, 0.16, 0.11);
      vec3 brown = vec3(0.18, 0.105, 0.075);
      vec3 charcoal = vec3(0.07, 0.065, 0.06);
      float grain = hash(vUv * 900.0 + time * 0.02);
      float vignette = smoothstep(0.88, 0.12, distance(vUv, vec2(0.5)));
      vec3 clay = mix(charcoal, mix(brown, terracotta, vLift), vignette);
      clay += (grain - 0.5) * 0.085;
      gl_FragColor = vec4(clay, 1.0);
    }
  `
);

const ParticleMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color("#ffffff"), opacity: 1 },
  `
    uniform float time;
    attribute float speed;
    attribute float scale;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      float t = clamp(time * speed, 0.0, 1.0);
      pos.xy *= (1.0 - t * 0.72);
      pos.z += sin(t * 6.283 + scale) * 0.2;
      vAlpha = (1.0 - t) * (0.5 + scale * 0.5);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (12.0 * scale) / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform vec3 color;
    uniform float opacity;
    varying float vAlpha;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      float soft = smoothstep(0.5, 0.08, d);
      gl_FragColor = vec4(color, soft * vAlpha * opacity);
    }
  `
);

function ClaySurface({ phase }) {
  const mat = useRef();
  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.time.value += delta;
  });

  return (
    <group position={[0, -2.95, -7]} rotation={[-Math.PI / 2.35, 0, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[28, 18, 180, 120]} />
        <clayMaterial ref={mat} />
      </mesh>
      <OrganicGrowth phase={phase} />
    </group>
  );
}

function OrganicGrowth({ phase }) {
  const items = useMemo(() => {
    return Array.from({ length: 54 }, (_, index) => ({
      x: (Math.random() - 0.5) * 21,
      y: (Math.random() - 0.5) * 11,
      size: 0.06 + Math.random() * 0.14,
      flower: index % 7 === 0,
      rot: Math.random() * Math.PI
    }));
  }, []);

  return (
    <group>
      {items.map((item, index) => (
        <group
          key={index}
          position={[item.x, item.y, 0.08]}
          rotation={[0, 0, item.rot]}
          scale={phase === "collapse" ? 0.1 : 1}
        >
          <mesh>
            <coneGeometry args={[item.size * 0.28, item.size * 2.6, 5]} />
            <meshStandardMaterial color={item.flower ? "#7c5f3d" : "#6f7c42"} roughness={0.9} />
          </mesh>
          {item.flower && (
            <mesh position={[0, 0, item.size * 1.55]}>
              <sphereGeometry args={[item.size * 0.42, 8, 8]} />
              <meshStandardMaterial color="#ead6bd" roughness={0.7} emissive="#2b160e" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function FloatingWords({ cursor, phase, onAbsorb }) {
  const group = useRef();
  const wordData = useMemo(
    () =>
      Array.from({ length: 240 }, (_, index) => ({
        id: index,
        text: words[index % words.length],
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 9,
        z: -16 - Math.random() * 34,
        speed: 0.028 + Math.random() * 0.055,
        size: 0.16 + Math.random() * 0.32,
        weight: Math.random() > 0.74 ? 700 : 400,
        wobble: Math.random() * Math.PI * 2,
        absorbed: false,
        aware: 0
      })),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const collapse = phase === "collapse";
    group.current.children.forEach((child, index) => {
      const item = wordData[index];
      if (!item || item.absorbed) {
        child.visible = false;
        return;
      }
      item.z += (collapse ? 2.8 : item.speed) * delta * 8;
      if (item.z > 2 || collapse) {
        item.x += (0 - item.x) * delta * (collapse ? 2.8 : 0.05);
        item.y += (0 - item.y) * delta * (collapse ? 2.8 : 0.05);
      }
      if (item.z > 3.5) {
        item.z = -38 - Math.random() * 18;
        item.x = (Math.random() - 0.5) * 18;
        item.y = (Math.random() - 0.5) * 9;
      }

      const projected = new THREE.Vector3(item.x, item.y, item.z).project(state.camera);
      const sx = projected.x * 0.5 + 0.5;
      const sy = -projected.y * 0.5 + 0.5;
      const dx = sx - cursor.current.x;
      const dy = sy - cursor.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const withinField = !collapse && distance < 0.085 && item.z > -14 && item.z < 1.5;
      item.aware += ((withinField ? 1 : 0) - item.aware) * delta * 5.5;
      if (withinField && item.aware > 0.82) {
        item.absorbed = true;
        onAbsorb([item.x, item.y, item.z], item.size);
      }

      child.visible = true;
      child.position.set(
        item.x + Math.sin(state.clock.elapsedTime * 3.6 + item.wobble) * item.aware * 0.05,
        item.y + Math.cos(state.clock.elapsedTime * 4.1 + item.wobble) * item.aware * 0.045,
        item.z
      );
      child.rotation.z = Math.sin(state.clock.elapsedTime + item.wobble) * 0.025;
      child.material.opacity = Math.max(0, Math.min(1, (item.z + 36) / 14)) * (1 - item.aware * 0.25);
      child.scale.setScalar(1 + item.aware * 0.08);
    });
  });

  return (
    <group ref={group}>
      {wordData.map((item) => (
        <Text
          key={item.id}
          fontSize={item.size}
          fontWeight={item.weight}
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
          material-transparent
          material-opacity={0}
          material-depthWrite={false}
        >
          {item.text}
        </Text>
      ))}
    </group>
  );
}

function ParticleBurst({ burst, onDone }) {
  const ref = useRef();
  const mat = useRef();
  const geometry = useMemo(() => {
    const count = 96;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * burst.size * 3.2;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * burst.size;
      speeds[i] = 0.65 + Math.random() * 0.8;
      scales[i] = 0.35 + Math.random() * 0.9;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [burst.size]);

  useFrame((_, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.time.value += delta * 0.55;
    if (mat.current.uniforms.time.value > 1.25) onDone(burst.id);
  });

  return (
    <points ref={ref} position={burst.position} geometry={geometry}>
      <particleMaterial ref={mat} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ cursor, phase }) {
  const [bursts, setBursts] = useState([]);
  const portalRef = useRef();

  useFrame((state, delta) => {
    if (portalRef.current) {
      const target = phase === "collapse" ? 2.8 : 1;
      portalRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 2.6);
      portalRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
      portalRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
    }
  });

  const addBurst = (position, size) => {
    setBursts((current) => [
      ...current.slice(-24),
      { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, position, size }
    ]);
  };

  return (
    <>
      <color attach="background" args={["#120f0d"]} />
      <fog attach="fog" args={["#120f0d", 6, 36]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 8, 4]} intensity={1.8} color="#ffd6b2" />
      <pointLight position={[-5, 2, 1]} intensity={6} color="#b56a45" distance={12} />
      <ClaySurface phase={phase} />
      <FloatingWords cursor={cursor} phase={phase} onAbsorb={addBurst} />
      {bursts.map((burst) => (
        <ParticleBurst
          key={burst.id}
          burst={burst}
          onDone={(id) => setBursts((current) => current.filter((item) => item.id !== id))}
        />
      ))}
      <group ref={portalRef} position={[0, 0, -1.5]}>
        <mesh>
          <sphereGeometry args={[1.18, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.62}
            thickness={0.78}
            roughness={0.08}
            metalness={0}
            clearcoat={1}
            transparent
            opacity={0.18}
            envMapIntensity={1.4}
          />
        </mesh>
      </group>
      <EffectComposer>
        <DepthOfField focusDistance={0.018} focalLength={0.032} bokehScale={3.1} />
        <Bloom intensity={1.25} luminanceThreshold={0.25} luminanceSmoothing={0.22} />
        <Noise opacity={0.12} />
        <Vignette eskil={false} offset={0.18} darkness={0.74} />
      </EffectComposer>
    </>
  );
}

function CursorField({ hidden }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 24, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 170, damping: 24, mass: 0.55 });

  useEffect(() => {
    const handleMove = (event) => {
      x.set(event.clientX - 86);
      y.set(event.clientY - 86);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      className="cursor-field"
      style={{ x: springX, y: springY }}
      animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.28 : 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function PortalCard({ onEnter, phase }) {
  return (
    <motion.button
      className="portal-card"
      type="button"
      onClick={onEnter}
      disabled={phase !== "idle"}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{
        opacity: phase === "collapse" ? 0 : 1,
        y: 0,
        scale: phase === "collapse" ? 1.18 : 1
      }}
      whileHover={{ scale: 1.045 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
    >
      <span>Living Language Space</span>
      <strong>Start Speaking</strong>
      <em>Enter the Language Space</em>
    </motion.button>
  );
}

function CollapsePoint({ phase }) {
  return (
    <motion.div
      className="collapse-point"
      initial={false}
      animate={{
        opacity: phase === "collapse" ? [0, 1, 1, 0] : 0,
        scale: phase === "collapse" ? [0.2, 1.1, 0.42, 0] : 0
      }}
      transition={{ duration: 2.2, times: [0, 0.28, 0.72, 1], ease: "easeInOut" }}
    />
  );
}

function LandingExperience({ onComplete }) {
  const cursor = useRef({ x: 0.5, y: 0.5 });
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const handleMove = (event) => {
      cursor.current = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const enter = () => {
    setPhase("collapse");
    window.setTimeout(onComplete, 2250);
  };

  return (
    <motion.section className="landing" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <Canvas camera={{ position: [0, 0, 7.5], fov: 52 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Scene cursor={cursor} phase={phase} />
        </Suspense>
      </Canvas>
      <div className="ambient-copy">
        <span>AI English Speaking Platform</span>
        <span>Spatial Typography · Organic Clay · Liquid Glass</span>
      </div>
      <PortalCard onEnter={enter} phase={phase} />
      <CursorField hidden={phase === "collapse"} />
      <CollapsePoint phase={phase} />
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
          <h1>Practice real English conversations inside the language space.</h1>
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <LandingExperience key="landing" onComplete={() => setEntered(true)} />
      ) : (
        <motion.div key="app" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}>
          <SpeakingApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

extend({ ClayMaterial, ParticleMaterial });
