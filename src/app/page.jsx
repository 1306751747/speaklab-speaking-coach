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
    label: "面试",
    title: "面试口语",
    prompt: "请试着用英语介绍一个你最有成就感的项目。",
    goal: "练习用角色、行动、结果和反思组织回答。"
  },
  {
    id: "restaurant",
    label: "点餐",
    title: "点餐表达",
    prompt: "请试着用英语完成一次温柔自然的点餐对话。",
    goal: "练习偏好、忌口、询问推荐和确认订单。"
  },
  {
    id: "meeting",
    label: "会议",
    title: "会议沟通",
    prompt: "请试着用英语说说你最近的进展和变化。",
    goal: "练习简洁汇报、说明阻碍、提出方案和确认行动项。"
  },
  {
    id: "travel",
    label: "旅行",
    title: "旅行沟通",
    prompt: "请试着用英语说明你的入住需求和今天的旅行安排。",
    goal: "练习酒店入住、交通询问、行程安排和礼貌确认。"
  },
  {
    id: "campus",
    label: "校园",
    title: "校园交流",
    prompt: "请试着用英语和同学讨论一次课程任务或学习计划。",
    goal: "练习课堂讨论、学习计划、同学协作和观点表达。"
  },
  {
    id: "support",
    label: "客服",
    title: "客服求助",
    prompt: "请试着用英语描述你遇到的问题，并请求对方帮助解决。",
    goal: "练习说明问题、补充细节、确认方案和表达感谢。"
  },
  {
    id: "social",
    label: "社交",
    title: "社交寒暄",
    prompt: "请试着用英语做一个轻松自然的自我介绍。",
    goal: "练习兴趣表达、轻松寒暄、延展话题和自然回应。"
  }
];

const growthModules = [
  { title: "学习", text: "每日开口", accent: "green" },
  { title: "复习", text: "表达回顾", accent: "rose" },
  { title: "阅读习惯", text: "积累语感", accent: "sand" },
  { title: "表达训练", text: "清晰输出", accent: "brown" },
  { title: "面试口语", text: "自信回答", accent: "rose" },
  { title: "日常交流", text: "自然对话", accent: "green" }
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
      <section className="growth-dashboard">
        <div className="growth-main">
          <header className="welcome-card soft-card">
            <div className="welcome-copy">
              <span className="page-pill">主页</span>
              <h1>早安，梦想家 ☀️</h1>
              <p>今天也来慢慢开口吧，稳定表达也是认真成长 🌱</p>
            </div>
            <span className="clay-brand-mark" aria-hidden="true">
              <i />
              <b />
            </span>
          </header>

          <div className="metric-row">
            <article className="metric-card soft-card">
              <strong>{turns.length || 5}</strong>
              <span>次练习记录</span>
            </article>
            <article className="metric-card soft-card">
              <strong>{turns[0]?.analysis?.overall || 78}%</strong>
              <span>最近完成度</span>
            </article>
          </div>

          <article className="affirmation-card soft-card">
            <div>
              <span className="section-kicker">今日肯定语</span>
              <p>我会越来越自信地开口表达，也会温柔地接住每一次练习。</p>
            </div>
            <span className="tiny-sprout" aria-hidden="true" />
          </article>

          <article className="goal-card soft-card">
            <div className="card-title-row">
              <span className="section-kicker">最近目标</span>
              <b>学习新技能 - 65%</b>
            </div>
            <div className="soft-progress" aria-hidden="true">
              <span />
            </div>
          </article>

          <section className="module-grid" aria-label="成长模块">
            {growthModules.map((item) => (
              <article key={item.title} className={`module-card soft-card accent-${item.accent}`}>
                <span aria-hidden="true" />
                <div>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside className="practice-side">
          <section className="scenario-card soft-card">
            <div className="card-title-row">
              <span className="section-kicker">练习场景</span>
              <b>{scenario.title}</b>
            </div>
            <div className="scenario-tabs">
              {scenarios.map((item) => (
                <button
                  key={item.id}
                  className={item.id === scenario.id ? "active" : ""}
                  type="button"
                  onClick={() => setScenario(item)}
                >
                  <span className="scenario-dot" aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="coach-panel dialogue-panel soft-card">
            <div className="panel-heading">
              <span className="panel-icon panel-icon-dialogue" aria-hidden="true" />
              <span>今日练习</span>
            </div>
            <h2>{scenario.prompt}</h2>
            <p>{scenario.goal}</p>
            <div className="clay-input-shell">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="请在这里输入你的回答，或点击麦克风开始练习"
              />
            </div>
            <div className="coach-actions">
              <button type="button" onClick={() => recognitionRef.current?.start()} disabled={!SpeechRecognition || listening}>
                <span className="button-orb" aria-hidden="true" />
                {listening ? "正在聆听" : "麦克风练习"}
              </button>
              <button type="button" onClick={submit}>
                <span className="button-orb" aria-hidden="true" />
                提交回答
              </button>
            </div>
            <div className="clay-session-strip" aria-label="练习提示">
              <span>说完整句子</span>
              <span>补充一个理由</span>
              <span>结尾自然停顿</span>
            </div>
          </section>

          <section className="coach-panel score-panel-next soft-card">
            <div className="panel-heading">
              <span className="panel-icon panel-icon-score" aria-hidden="true" />
              <span>实时反馈</span>
            </div>
            <ScoreDashboard latest={turns[0]?.analysis} />
            <CorrectionList latest={turns[0]?.analysis} />
          </section>
        </aside>
      </section>
    </main>
  );
}

function ScoreDashboard({ latest }) {
  const score = latest || { overall: "--", fluency: "--", grammar: "--", relevance: "--" };
  const progress = typeof score.overall === "number" ? `${score.overall * 3.6}deg` : "0deg";
  return (
    <div className="score-dashboard">
      <strong className="score-ring" style={{ "--score-progress": progress }}>{score.overall}</strong>
      <div>
        <p>流利度 <span>{score.fluency}</span></p>
        <p>语法 <span>{score.grammar}</span></p>
        <p>语境 <span>{score.relevance}</span></p>
      </div>
    </div>
  );
}

function CorrectionList({ latest }) {
  const items = latest
    ? latest.corrections.length
      ? latest.corrections
      : ["这次表达比较完整，可以继续尝试加入更具体的例子。"]
    : ["完成一次回答后，这里会显示表达建议。"];
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
  if (/\bi am agree\b/i.test(text)) corrections.push("可以把 “I am agree” 改成更自然的 “I agree”。");
  if (/\bdiscuss about\b/i.test(text)) corrections.push("表达 “讨论某事” 时，建议说 “discuss the topic”。");
  if (wordsInAnswer.length < 10) corrections.push("回答可以再补充一个理由和一个例子，会更完整。");
  if (!/[.!?]$/.test(text.trim())) corrections.push("结尾加上清晰的句号或停顿，会更像完整表达。");
  const keywords = {
    interview: ["project", "role", "impact", "team", "challenge"],
    restaurant: ["order", "recommend", "allergy", "drink", "confirm"],
    meeting: ["progress", "blocker", "timeline", "action", "owner"],
    travel: ["hotel", "check", "transport", "trip", "reservation"],
    campus: ["course", "class", "study", "assignment", "partner"],
    support: ["problem", "issue", "help", "solution", "confirm"],
    social: ["name", "hobby", "interest", "meet", "share"]
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
    meeting: ["What is the next action item?", "Who should own that task?", "How should the timeline change?"],
    travel: ["Could you ask about the check-in time?", "How would you confirm your reservation?", "Could you ask for directions politely?"],
    campus: ["Could you explain your study plan?", "How would you ask a classmate for help?", "Could you share one opinion about the course?"],
    support: ["Could you describe the problem more clearly?", "What solution would you like to request?", "How would you confirm the next step?"],
    social: ["Could you add one detail about your hobby?", "How would you ask a friendly follow-up question?", "Could you make the introduction warmer?"]
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
