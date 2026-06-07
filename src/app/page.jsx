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
    id: "daily_chat",
    category: "基础生活",
    label: "日常聊天",
    title: "日常聊天",
    prompt: "请试着用英语聊聊今天发生的一件小事。",
    goal: "练习自然寒暄、补充细节和轻松回应。",
    task: "完成一次日常聊天开场和回应",
    duration: "3 分钟",
    mustSay: ["今天发生了什么", "你的感受", "一个追问"],
    patterns: ["Today I want to share...", "It made me feel...", "How about you?"]
  },
  {
    id: "self_intro",
    category: "基础生活",
    label: "自我介绍",
    title: "自我介绍",
    prompt: "请试着用英语做一个轻松自然的自我介绍。",
    goal: "练习介绍姓名、背景、兴趣和一个延展话题。",
    task: "完成一次自然自我介绍",
    duration: "3 分钟",
    mustSay: ["你的名字", "你的背景", "一个兴趣"],
    patterns: ["Nice to meet you.", "I am currently...", "I am interested in..."]
  },
  {
    id: "directions",
    category: "基础生活",
    label: "问路",
    title: "问路表达",
    prompt: "请试着用英语询问路线，并确认怎么到达目的地。",
    goal: "练习礼貌提问、地点描述和确认路线。",
    task: "完成一次问路和路线确认",
    duration: "3 分钟",
    mustSay: ["目的地", "当前位置", "确认路线"],
    patterns: ["Excuse me, how can I get to...?", "Is it far from here?", "Should I turn left or right?"]
  },
  {
    id: "shopping",
    category: "基础生活",
    label: "购物",
    title: "购物沟通",
    prompt: "请试着用英语询问商品、价格和尺码。",
    goal: "练习询价、描述需求、确认购买信息。",
    task: "完成一次购物询问和确认",
    duration: "3 分钟",
    mustSay: ["想买什么", "价格或尺码", "确认付款"],
    patterns: ["How much is this?", "Do you have this in...?", "I would like to buy it."]
  },
  {
    id: "interview",
    category: "学习工作",
    label: "面试",
    title: "面试口语",
    prompt: "请试着用英语介绍一个你最有成就感的项目。",
    goal: "练习用角色、行动、结果和反思组织回答。",
    task: "用 STAR 结构完成一次项目经历回答",
    duration: "3 分钟",
    mustSay: ["项目背景", "你的角色", "结果和收获"],
    patterns: ["I was responsible for...", "The biggest challenge was...", "As a result..."]
  },
  {
    id: "restaurant",
    category: "基础生活",
    label: "餐厅点餐",
    title: "点餐表达",
    prompt: "请试着用英语完成一次温柔自然的点餐对话。",
    goal: "练习偏好、忌口、询问推荐和确认订单。",
    task: "完成推荐询问、忌口说明和订单确认",
    duration: "3 分钟",
    mustSay: ["你想点什么", "是否有忌口", "确认订单"],
    patterns: ["What do you recommend?", "I am allergic to...", "Could you confirm my order?"]
  },
  {
    id: "meeting",
    category: "学习工作",
    label: "会议",
    title: "会议沟通",
    prompt: "请试着用英语说说你最近的进展和变化。",
    goal: "练习简洁汇报、说明阻碍、提出方案和确认行动项。",
    task: "完成一次进展、阻碍和下一步汇报",
    duration: "3 分钟",
    mustSay: ["最近进展", "当前阻碍", "下一步行动"],
    patterns: ["Here is my progress...", "The main blocker is...", "Next, I will..."]
  },
  {
    id: "travel",
    category: "旅行应急",
    label: "旅行",
    title: "旅行沟通",
    prompt: "请试着用英语说明你的入住需求和今天的旅行安排。",
    goal: "练习酒店入住、交通询问、行程安排和礼貌确认。",
    task: "完成酒店入住确认和交通询问",
    duration: "3 分钟",
    mustSay: ["预订信息", "入住时间", "交通需求"],
    patterns: ["I have a reservation under...", "Could I check in now?", "How can I get to...?"]
  },
  {
    id: "campus",
    category: "学习工作",
    label: "课堂讨论",
    title: "课堂讨论",
    prompt: "请试着用英语和同学讨论一次课程任务或学习计划。",
    goal: "练习课堂讨论、学习计划、同学协作和观点表达。",
    task: "和同学说明学习计划并提出协作请求",
    duration: "3 分钟",
    mustSay: ["课程任务", "你的计划", "需要的帮助"],
    patterns: ["For this assignment...", "My plan is to...", "Could we work together on...?"]
  },
  {
    id: "support",
    category: "旅行应急",
    label: "客服",
    title: "客服求助",
    prompt: "请试着用英语描述你遇到的问题，并请求对方帮助解决。",
    goal: "练习说明问题、补充细节、确认方案和表达感谢。",
    task: "清楚描述问题并确认解决方案",
    duration: "3 分钟",
    mustSay: ["遇到的问题", "已尝试的方法", "希望的解决方案"],
    patterns: ["I am having trouble with...", "I have already tried...", "Could you help me with...?"]
  },
  {
    id: "social",
    category: "社交表达",
    label: "交朋友",
    title: "交朋友",
    prompt: "请试着用英语做一个轻松自然的自我介绍。",
    goal: "练习兴趣表达、轻松寒暄、延展话题和自然回应。",
    task: "完成自我介绍并自然延展一个话题",
    duration: "3 分钟",
    mustSay: ["你的名字", "一个兴趣", "一个追问"],
    patterns: ["Nice to meet you.", "I am interested in...", "What about you?"]
  },
  {
    id: "hotel",
    category: "基础生活",
    label: "酒店入住",
    title: "酒店入住",
    prompt: "请试着用英语完成酒店入住，并说明你的房间需求。",
    goal: "练习预订确认、入住时间、房间需求和礼貌沟通。",
    task: "完成一次酒店入住确认",
    duration: "3 分钟",
    mustSay: ["预订姓名", "入住时间", "房间需求"],
    patterns: ["I have a reservation under...", "Could I check in now?", "Could I have a quiet room?"]
  },
  {
    id: "airport",
    category: "基础生活",
    label: "机场出行",
    title: "机场出行",
    prompt: "请试着用英语询问登机口、行李和航班信息。",
    goal: "练习机场问询、确认信息和应对延误。",
    task: "完成一次机场信息确认",
    duration: "3 分钟",
    mustSay: ["航班信息", "行李问题", "登机口确认"],
    patterns: ["Where is gate...?", "Can I check this bag?", "Has the flight been delayed?"]
  },
  {
    id: "medical",
    category: "基础生活",
    label: "看病就医",
    title: "看病就医",
    prompt: "请试着用英语描述身体不舒服的情况。",
    goal: "练习症状描述、持续时间和请求建议。",
    task: "清楚描述症状并询问建议",
    duration: "3 分钟",
    mustSay: ["哪里不舒服", "持续多久", "希望得到什么帮助"],
    patterns: ["I don't feel well.", "I have had this for...", "What should I do?"]
  },
  {
    id: "report",
    category: "学习工作",
    label: "汇报",
    title: "工作汇报",
    prompt: "请试着用英语做一次简洁的工作进度汇报。",
    goal: "练习进展、问题、数据和下一步计划。",
    task: "完成一次进度和下一步汇报",
    duration: "3 分钟",
    mustSay: ["已完成内容", "遇到的问题", "下一步计划"],
    patterns: ["So far, I have finished...", "The main issue is...", "Next, I plan to..."]
  },
  {
    id: "email",
    category: "学习工作",
    label: "邮件沟通",
    title: "邮件沟通",
    prompt: "请试着用英语说明一封工作邮件的核心内容。",
    goal: "练习清晰表达请求、背景和截止时间。",
    task: "完成一次邮件内容口头说明",
    duration: "3 分钟",
    mustSay: ["邮件目的", "需要对方做什么", "截止时间"],
    patterns: ["I am writing to...", "Could you please...?", "It would be helpful if..."]
  },
  {
    id: "project",
    category: "学习工作",
    label: "项目沟通",
    title: "项目沟通",
    prompt: "请试着用英语和同事沟通项目安排。",
    goal: "练习任务分工、时间线、风险和协作请求。",
    task: "说明项目安排并确认分工",
    duration: "3 分钟",
    mustSay: ["任务分工", "时间安排", "风险或请求"],
    patterns: ["Could you take care of...?", "The deadline is...", "One possible risk is..."]
  },
  {
    id: "academic",
    category: "学习工作",
    label: "学术交流",
    title: "学术交流",
    prompt: "请试着用英语说明一个学习或研究观点。",
    goal: "练习观点表达、理由和例子。",
    task: "表达一个学术观点并补充理由",
    duration: "3 分钟",
    mustSay: ["你的观点", "一个理由", "一个例子"],
    patterns: ["In my opinion...", "One reason is...", "For example..."]
  },
  {
    id: "hobby",
    category: "社交表达",
    label: "兴趣爱好",
    title: "兴趣爱好",
    prompt: "请试着用英语介绍一个你喜欢的兴趣爱好。",
    goal: "练习描述兴趣、原因和相关经历。",
    task: "介绍一个兴趣并延展话题",
    duration: "3 分钟",
    mustSay: ["你的兴趣", "为什么喜欢", "最近一次经历"],
    patterns: ["I enjoy...", "I like it because...", "The last time I did it..."]
  },
  {
    id: "emotion",
    category: "社交表达",
    label: "情绪表达",
    title: "情绪表达",
    prompt: "请试着用英语表达你最近的一种心情。",
    goal: "练习情绪词、原因和自我照顾表达。",
    task: "表达一种情绪并说明原因",
    duration: "3 分钟",
    mustSay: ["你的心情", "原因", "你想怎么调整"],
    patterns: ["Today I feel...", "I think it is because...", "I want to..."]
  },
  {
    id: "opinion",
    category: "社交表达",
    label: "表达观点",
    title: "表达观点",
    prompt: "请试着用英语表达你对一个话题的看法。",
    goal: "练习观点、理由、例子和礼貌表达不同意见。",
    task: "表达一个观点并给出理由",
    duration: "3 分钟",
    mustSay: ["你的观点", "理由", "例子"],
    patterns: ["I think...", "In my view...", "I partly agree because..."]
  },
  {
    id: "story",
    category: "社交表达",
    label: "讲述经历",
    title: "讲述经历",
    prompt: "请试着用英语讲述一次让你印象深刻的经历。",
    goal: "练习时间顺序、细节和感受。",
    task: "讲述一次经历并说明收获",
    duration: "3 分钟",
    mustSay: ["发生了什么", "你的感受", "你的收获"],
    patterns: ["It happened when...", "At first...", "I learned that..."]
  },
  {
    id: "plan",
    category: "社交表达",
    label: "计划安排",
    title: "计划安排",
    prompt: "请试着用英语说明一个近期计划。",
    goal: "练习时间、目标、准备和确认安排。",
    task: "说明一个计划并确认下一步",
    duration: "3 分钟",
    mustSay: ["计划内容", "时间安排", "下一步"],
    patterns: ["I plan to...", "I am going to...", "The next step is..."]
  },
  {
    id: "transport",
    category: "旅行应急",
    label: "交通",
    title: "交通沟通",
    prompt: "请试着用英语询问交通方式、票价和到达时间。",
    goal: "练习交通问询、路线确认和时间表达。",
    task: "完成一次交通方式确认",
    duration: "3 分钟",
    mustSay: ["目的地", "交通方式", "预计时间"],
    patterns: ["Which bus should I take?", "How long does it take?", "How much is the ticket?"]
  },
  {
    id: "emergency",
    category: "旅行应急",
    label: "紧急求助",
    title: "紧急求助",
    prompt: "请试着用英语说明你遇到的紧急情况并请求帮助。",
    goal: "练习清楚描述问题、位置和需要的帮助。",
    task: "说明紧急情况并请求帮助",
    duration: "3 分钟",
    mustSay: ["发生了什么", "你在哪里", "需要什么帮助"],
    patterns: ["I need help.", "I am at...", "Could you call...?"]
  },
  {
    id: "complaint",
    category: "旅行应急",
    label: "投诉沟通",
    title: "投诉沟通",
    prompt: "请试着用英语礼貌说明问题并提出解决请求。",
    goal: "练习投诉描述、证据说明和解决方案请求。",
    task: "礼貌投诉并请求解决方案",
    duration: "3 分钟",
    mustSay: ["问题是什么", "影响是什么", "希望如何解决"],
    patterns: ["I would like to report a problem.", "This affected...", "Could you help resolve it?"]
  }
];

const freeChatScenario = {
  id: "free_chat",
  mode: "freeChat",
  category: "自由对话",
  label: "自由对话",
  title: "自由对话",
  prompt: "自由对话",
  goal: "想聊什么都可以，试着用英语自然表达。",
  task: "想聊什么都可以，试着用英语自然表达。",
  duration: "自由",
  helper: "你可以聊今天的心情、学习、生活、旅行、兴趣，或者任何你想练习的话题。",
  mustSay: ["尝试表达一个完整想法", "可以使用简单句", "不用担心语法错误"],
  patterns: ["I want to talk about...", "Today I feel...", "Can we talk about...?", "I have a question about..."]
};

const scenarioGroups = [
  { title: "基础生活", ids: ["daily_chat", "self_intro", "directions", "shopping", "restaurant", "hotel", "airport", "medical"] },
  { title: "学习工作", ids: ["interview", "meeting", "report", "campus", "email", "project", "academic"] },
  { title: "社交表达", ids: ["social", "hobby", "emotion", "opinion", "story", "plan"] },
  { title: "旅行应急", ids: ["travel", "transport", "emergency", "complaint", "support"] }
];

const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));

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
  const [mode, setMode] = useState("scenario");
  const [scenario, setScenario] = useState(scenarios[0]);
  const [activeCategory, setActiveCategory] = useState(scenarios[0].category);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState([]);
  const [expressionAssets, setExpressionAssets] = useState([]);
  const [assetsReady, setAssetsReady] = useState(false);
  const [chineseIdea, setChineseIdea] = useState("");
  const [scaffold, setScaffold] = useState(null);
  const [scaffoldLoading, setScaffoldLoading] = useState(false);
  const [scaffoldError, setScaffoldError] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const practiceRef = useRef(null);
  const activePractice = mode === "freeChat" ? freeChatScenario : scenario;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("speaklab-expression-assets");
      if (stored) setExpressionAssets(JSON.parse(stored));
    } catch {
      setExpressionAssets([]);
    } finally {
      setAssetsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!assetsReady) return;
    window.localStorage.setItem("speaklab-expression-assets", JSON.stringify(expressionAssets.slice(0, 12)));
  }, [assetsReady, expressionAssets]);

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

  const submit = async () => {
    const answer = draft.trim();
    if (!answer) return;

    const turnId = createTurnId();
    const localAnalysis = { ...analyzeSpeech(answer, activePractice.id, mode), source: "local", pending: true };
    setTurns((current) => [{ id: turnId, text: answer, analysis: localAnalysis }, ...current].slice(0, 6));
    setDraft("");

    try {
      const aiFeedback = await requestAiFeedback({ answer, scenario: activePractice, mode, localAnalysis });
      const aiAnalysis = {
        ...localAnalysis,
        ...aiFeedback,
        source: "ai",
        pending: false
      };
      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                analysis: aiAnalysis
              }
            : turn
        )
      );
      setExpressionAssets((current) =>
        mergeExpressionAssets(current, createExpressionAssets({ answer, scenario: activePractice, analysis: aiAnalysis }))
      );
      speakCoachLine(extractSpeakableCoachLine(aiFeedback.nextQuestion || nextCoachLine(activePractice.id, turns.length + 1, mode)));
    } catch (error) {
      const fallbackAnalysis = {
        ...localAnalysis,
        pending: false,
        feedbackError: "AI 反馈暂时不可用，已保留本地规则反馈。"
      };
      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                analysis: fallbackAnalysis
              }
            : turn
        )
      );
      setExpressionAssets((current) =>
        mergeExpressionAssets(current, createExpressionAssets({ answer, scenario: activePractice, analysis: fallbackAnalysis }))
      );
      speakCoachLine(nextCoachLine(activePractice.id, turns.length + 1, mode));
    }
  };

  const startDailyPractice = () => {
    practiceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const generateScaffold = async () => {
    const idea = chineseIdea.trim();
    if (!idea) return;
    setScaffoldLoading(true);
    setScaffoldError("");
    try {
      const result = await requestExpressionScaffold({ idea, scenario: activePractice, mode });
      setScaffold({ ...result.scaffold, source: "ai", model: result.model });
    } catch {
      setScaffold(createLocalScaffold(idea, activePractice));
      setScaffoldError("AI 脚手架暂时不可用，已提供本地开口模板。");
    } finally {
      setScaffoldLoading(false);
    }
  };

  const useScaffoldLine = (line) => {
    setDraft(line);
    practiceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="app-shell">
      <div className="app-garden-decor" aria-hidden="true">
        <span className="garden-piece garden-flower piece-1"><i /><b /></span>
        <span className="garden-piece garden-sprout piece-2"><i /><b /></span>
        <span className="garden-piece garden-leaf piece-3"><i /></span>
        <span className="garden-piece garden-flower piece-4"><i /><b /></span>
        <span className="garden-piece garden-grass piece-5"><i /><b /><em /></span>
        <span className="garden-piece garden-leaf piece-6"><i /></span>
      </div>
      <section className="growth-dashboard">
        <header className="workbench-top soft-card">
          <div className="welcome-copy">
            <span className="page-pill">练习工作台</span>
            <h1>早安，梦想家 ☀️</h1>
            <p>今天也来慢慢开口吧，稳定表达也是认真成长 🌱</p>
          </div>
          <article className="top-task-card">
            <span className="section-kicker">今日任务</span>
            <b>{activePractice.task}</b>
            <p>{activePractice.goal}</p>
            <button type="button" onClick={startDailyPractice}>开始练习</button>
          </article>
          <aside className="top-support">
            <div className="mini-metrics">
              <span><b>{turns.length || 5}</b> 次练习</span>
              <span><b>{turns[0]?.analysis?.overall || 78}%</b> 最近完成度</span>
            </div>
            <div className="mini-affirmation">
              <span className="tiny-sprout" aria-hidden="true" />
              <p>我会越来越自信地开口表达。</p>
            </div>
          </aside>
        </header>

        <div className="workbench-grid">
          <aside className="practice-nav">
            <section className="scenario-card soft-card">
              <div className="card-title-row">
                <span className="section-kicker">练习模式</span>
                <b>{mode === "freeChat" ? "自由对话" : "场景练习"}</b>
              </div>
              <div className="mode-toggle">
                <button
                  className={mode === "scenario" ? "active" : ""}
                  type="button"
                  onClick={() => setMode("scenario")}
                >
                  场景练习
                </button>
                <button
                  className={mode === "freeChat" ? "active" : ""}
                  type="button"
                  onClick={() => setMode("freeChat")}
                >
                  自由对话
                </button>
              </div>
              <button
                className={`free-chat-tab ${mode === "freeChat" ? "active" : ""}`}
                type="button"
                onClick={() => setMode("freeChat")}
              >
                <span className="scenario-dot" aria-hidden="true" />
                自由对话
              </button>
            </section>

            <section className="scenario-card soft-card">
              <div className="card-title-row">
                <span className="section-kicker">练习场景</span>
                <b>{mode === "scenario" ? scenario.label : "可随时切换"}</b>
              </div>
              <div className="category-tabs">
                {scenarioGroups.map((group) => (
                  <button
                    key={group.title}
                    className={activeCategory === group.title ? "active" : ""}
                    type="button"
                    onClick={() => setActiveCategory(group.title)}
                  >
                    {group.title}
                  </button>
                ))}
              </div>
              <div className="scenario-tabs compact">
                {(scenarioGroups.find((group) => group.title === activeCategory)?.ids || []).map((id) => {
                  const item = scenarioById.get(id);
                  if (!item) return null;
                  return (
                    <button
                      key={item.id}
                      className={mode === "scenario" && item.id === scenario.id ? "active" : ""}
                      type="button"
                      onClick={() => {
                        setMode("scenario");
                        setScenario(item);
                        setActiveCategory(item.category);
                      }}
                    >
                      <span className="scenario-dot" aria-hidden="true" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <ExpressionAssets assets={expressionAssets} />
          </aside>

          <section className="practice-main">
            <section className="coach-panel dialogue-panel soft-card" ref={practiceRef}>
            <div className="panel-heading">
              <span className="panel-icon panel-icon-dialogue" aria-hidden="true" />
              <span>{mode === "freeChat" ? "自由对话" : "今日练习"}</span>
            </div>
            <h2>{activePractice.prompt}</h2>
            <p>{activePractice.helper || activePractice.goal}</p>
            <div className="task-helper-grid" aria-label="练习任务提示">
              <div>
                <span className="section-kicker">{mode === "freeChat" ? "自由表达提示" : "必说 3 点"}</span>
                <ul>
                  {activePractice.mustSay.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="section-kicker">可用句型</span>
                <ul>
                  {activePractice.patterns.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <ChineseScaffold
              idea={chineseIdea}
              scaffold={scaffold}
              loading={scaffoldLoading}
              error={scaffoldError}
              onIdeaChange={setChineseIdea}
              onGenerate={generateScaffold}
              onUseLine={useScaffoldLine}
            />
            <div className="clay-input-shell">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={mode === "freeChat" ? "请输入你想说的话，或点击麦克风开始自由对话" : "请在这里输入你的回答，或点击麦克风开始练习"}
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
            <ScoreDashboard latest={turns[0]?.analysis} mode={mode} />
            <FreeChatReply latest={turns[0]?.analysis} mode={mode} />
            <CorrectionList latest={turns[0]?.analysis} answer={turns[0]?.text} scenario={activePractice} mode={mode} />
            <SessionSummary latest={turns[0]?.analysis} scenario={activePractice} />
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

function speakCoachLine(text) {
  if (!text || typeof window === "undefined") return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.93;
  window.speechSynthesis?.speak(utterance);
}

async function requestAiFeedback({ answer, scenario, mode, localAnalysis }) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer,
      scenario: {
        id: scenario.id,
        mode,
        label: scenario.label,
        title: scenario.title,
        prompt: scenario.prompt,
        goal: scenario.goal,
        mustSay: scenario.mustSay,
        patterns: scenario.patterns
      },
      localAnalysis
    })
  });

  if (!response.ok) {
    throw new Error("AI feedback request failed.");
  }

  const payload = await response.json();
  return {
    ...payload.feedback,
    model: payload.model
  };
}

async function requestExpressionScaffold({ idea, scenario, mode }) {
  const response = await fetch("/api/scaffold", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idea,
      scenario: {
        id: scenario.id,
        mode,
        label: scenario.label,
        title: scenario.title,
        prompt: scenario.prompt,
        goal: scenario.goal,
        patterns: scenario.patterns
      }
    })
  });

  if (!response.ok) {
    throw new Error("Expression scaffold request failed.");
  }

  return response.json();
}

function createTurnId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ChineseScaffold({ idea, scaffold, loading, error, onIdeaChange, onGenerate, onUseLine }) {
  return (
    <section className="scaffold-card" aria-label="中文表达脚手架">
      <div className="card-title-row">
        <span className="section-kicker">我想表达...</span>
        <b>中文脚手架</b>
      </div>
      <div className="scaffold-input-row">
        <textarea
          value={idea}
          onChange={(event) => onIdeaChange(event.target.value)}
          placeholder="先用中文写下你想表达的意思，例如：我想说自己负责了项目排期，也解决了一个沟通问题。"
        />
        <button type="button" onClick={onGenerate} disabled={loading || !idea.trim()}>
          {loading ? "生成中" : "生成英文表达"}
        </button>
      </div>
      {error && <p className="scaffold-note">{error}</p>}
      {scaffold && (
        <div className="scaffold-options">
          <ScaffoldOption label="简单版" text={scaffold.simple} onUseLine={onUseLine} />
          <ScaffoldOption label="自然版" text={scaffold.natural} onUseLine={onUseLine} />
          <ScaffoldOption label="正式版" text={scaffold.formal} onUseLine={onUseLine} />
          {scaffold.practiceTip && <p className="scaffold-note">{scaffold.practiceTip}</p>}
        </div>
      )}
    </section>
  );
}

function ScaffoldOption({ label, text, onUseLine }) {
  if (!text) return null;
  return (
    <article className="scaffold-option">
      <span>{label}</span>
      <p>{text}</p>
      <button type="button" onClick={() => onUseLine(text)}>
        放入回答
      </button>
    </article>
  );
}

function ExpressionAssets({ assets }) {
  const weeklyCount = assets.filter((asset) => Date.now() - asset.createdAt < 7 * 24 * 60 * 60 * 1000).length;
  const rewrite = assets.find((asset) => asset.type === "rewrite");
  const mistake = assets.find((asset) => asset.type === "mistake");
  const pattern = assets.find((asset) => asset.type === "pattern");

  return (
    <article className="asset-card soft-card">
      <div className="card-title-row">
        <span className="section-kicker">表达资产库</span>
        <b>本周新增 {weeklyCount} 条</b>
      </div>
      <div className="asset-list">
        <AssetItem label="推荐改写" asset={rewrite} fallback="完成一次练习后，会保存你的推荐改写。" />
        <AssetItem label="常错表达" asset={mistake} fallback="这里会沉淀最值得复习的表达问题。" />
        <AssetItem label="高分句型" asset={pattern} fallback="高分回答会自动保存可复用句型。" />
      </div>
    </article>
  );
}

function AssetItem({ label, asset, fallback }) {
  return (
    <section className="asset-item">
      <span>{label}</span>
      <p>{asset?.text || fallback}</p>
      {asset?.note && <em>{asset.note}</em>}
    </section>
  );
}

function ScoreDashboard({ latest, mode }) {
  const score = latest || { overall: "--", fluency: "--", grammar: "--", relevance: "--" };
  const progress = typeof score.overall === "number" ? `${score.overall * 3.6}deg` : "0deg";
  const labels = mode === "freeChat"
    ? [
        ["流利度", score.fluency],
        ["自然度", score.relevance],
        ["语法", score.grammar],
        ["表达清晰度", score.pronunciation || score.relevance]
      ]
    : [
        ["流利度", score.fluency],
        ["语法", score.grammar],
        ["语境", score.relevance]
      ];
  return (
    <div className="score-dashboard">
      <strong className="score-ring" style={{ "--score-progress": progress }}>{score.overall}</strong>
      <div>
        {labels.map(([label, value]) => (
          <p key={label}>{label} <span>{value}</span></p>
        ))}
      </div>
    </div>
  );
}

function FreeChatReply({ latest, mode }) {
  if (mode !== "freeChat" || !latest?.nextQuestion || latest.pending) return null;
  const [english, chineseTip] = splitCoachReply(latest.nextQuestion);
  return (
    <article className="free-chat-reply">
      <span className="section-kicker">AI 自然接话</span>
      <p>{english}</p>
      {chineseTip && <em>{chineseTip}</em>}
    </article>
  );
}

function CorrectionList({ latest, answer, scenario }) {
  if (latest?.pending) {
    return (
      <div className="correction-stack">
        <p>AI 正在结合场景任务生成更具体的纠错与表达建议。</p>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="correction-stack">
        <p>完成一次回答后，这里会显示表达建议。</p>
      </div>
    );
  }

  const gentle = createGentleCorrection({ latest, answer, scenario });

  return (
    <div className="correction-stack">
      <article className="gentle-correction">
        <span className="section-kicker">温柔纠错</span>
        <p>{gentle.praise}</p>
        <dl>
          <div>
            <dt>原句</dt>
            <dd>{gentle.original}</dd>
          </div>
          <div>
            <dt>建议</dt>
            <dd>{gentle.suggestion}</dd>
          </div>
          <div>
            <dt>原因</dt>
            <dd>{gentle.reason}</dd>
          </div>
        </dl>
      </article>
      {latest?.feedbackError && <p>{latest.feedbackError}</p>}
    </div>
  );
}

function SessionSummary({ latest, scenario }) {
  if (!latest) {
    return (
      <div className="session-summary">
        <span className="section-kicker">课后总结</span>
        <p>完成一次回答后，这里会生成你的表达亮点、推荐改写和下次重点。</p>
      </div>
    );
  }

  if (latest.pending) {
    return (
      <div className="session-summary">
        <span className="section-kicker">AI 课后总结</span>
        <p>正在生成表达亮点、自然改写和下一轮练习重点。</p>
      </div>
    );
  }

  if (latest.summary || latest.betterExpression) {
    return (
      <div className="session-summary">
        <span className="section-kicker">{latest.source === "ai" ? "AI 课后总结" : "课后总结"}</span>
        <div className="summary-grid">
          <article>
            <b>表达亮点</b>
            <p>{latest.summary?.strength || "你已经完成了本轮表达，整体意思比较清楚。"}</p>
          </article>
          <article>
            <b>推荐改写</b>
            <p>{latest.betterExpression || latest.summary?.rewrite || scenario.patterns[0]}</p>
          </article>
          <article>
            <b>下次重点</b>
            <p>{latest.summary?.nextFocus || "下次可以加入更具体的例子，让表达更有画面感。"}</p>
          </article>
        </div>
        {latest.model && <p className="feedback-source">由 {latest.model} 生成，已保留本地规则兜底。</p>}
      </div>
    );
  }

  const rewrite = scenario.patterns[0];
  const focus = latest.relevance < 72 ? "下次重点补充场景关键词，让回答更贴近任务。" : "下次可以加入更具体的例子，让表达更有画面感。";

  return (
    <div className="session-summary">
      <span className="section-kicker">课后总结</span>
      <div className="summary-grid">
        <article>
          <b>表达亮点</b>
          <p>你已经完成了本轮表达，整体意思比较清楚。</p>
        </article>
        <article>
          <b>推荐改写</b>
          <p>{rewrite}</p>
        </article>
        <article>
          <b>下次重点</b>
          <p>{focus}</p>
        </article>
      </div>
    </div>
  );
}

function createGentleCorrection({ latest, answer, scenario }) {
  const correction = latest.gentleCorrection || {};
  const firstCorrection = latest.corrections?.[0];
  return {
    praise: correction.praise || latest.summary?.strength || "你已经把想法说出来了，这一步本身就很重要。",
    original: correction.original || shortenText(answer || "你的本次回答", 120),
    suggestion: correction.suggestion || latest.betterExpression || scenario.patterns[0],
    reason: correction.reason || firstCorrection || "这样说会更自然，也更容易让对方理解你的重点。"
  };
}

function createLocalScaffold(idea, scenario) {
  const starter = scenario.patterns[0] || "I want to share one idea.";
  return {
    source: "local",
    simple: "I want to explain my idea clearly.",
    natural: `${starter} I can add one reason and one example.`,
    formal: "I would like to explain my idea with a clear reason and a specific example.",
    practiceTip: `本地模板已生成。你可以先用“${starter}”开头，再补充一个理由。`
  };
}

function createExpressionAssets({ answer, scenario, analysis }) {
  const assets = [];
  if (analysis.betterExpression) {
    assets.push(createExpressionAsset("rewrite", analysis.betterExpression, `${scenario.label} · 推荐改写`));
  }
  if (analysis.corrections?.[0]) {
    assets.push(createExpressionAsset("mistake", analysis.corrections[0], `${scenario.label} · 常错提醒`));
  }
  if (analysis.overall >= 85) {
    assets.push(createExpressionAsset("pattern", scenario.patterns[0], `${scenario.label} · 高分句型`));
  }
  if (!assets.length && answer) {
    assets.push(createExpressionAsset("rewrite", shortenText(answer, 120), `${scenario.label} · 本次表达`));
  }
  return assets;
}

function createExpressionAsset(type, text, note) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    text,
    note,
    createdAt: Date.now()
  };
}

function mergeExpressionAssets(current, incoming) {
  const normalized = [...incoming, ...current].filter((asset) => asset?.text);
  const seen = new Set();
  return normalized
    .filter((asset) => {
      const key = `${asset.type}:${asset.text.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

function shortenText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function splitCoachReply(reply) {
  if (!reply) return ["", ""];
  const parts = reply.split(/中文提示[:：]/);
  return [parts[0].trim(), parts[1]?.trim() || ""];
}

function extractSpeakableCoachLine(reply) {
  return splitCoachReply(reply)[0] || reply;
}

function analyzeSpeech(text, scenarioId, mode = "scenario") {
  const wordsInAnswer = text.match(/[A-Za-z']+/g) || [];
  const lower = text.toLowerCase();
  const fillers = (lower.match(/\b(um|uh|like|you know|basically)\b/g) || []).length;
  const corrections = [];
  if (/\bi am agree\b/i.test(text)) corrections.push("可以把 “I am agree” 改成更自然的 “I agree”。");
  if (/\bdiscuss about\b/i.test(text)) corrections.push("表达 “讨论某事” 时，建议说 “discuss the topic”。");
  if (wordsInAnswer.length < 10) corrections.push("回答可以再补充一个理由和一个例子，会更完整。");
  if (!/[.!?]$/.test(text.trim())) corrections.push("结尾加上清晰的句号或停顿，会更像完整表达。");
  const keywords = mode === "freeChat" ? ["feel", "today", "think", "want", "like", "question", "talk", "share"] : ({
    daily_chat: ["today", "feel", "share", "happened", "talk"],
    self_intro: ["name", "work", "study", "hobby", "interest"],
    directions: ["where", "go", "turn", "street", "station"],
    shopping: ["price", "size", "color", "buy", "pay"],
    interview: ["project", "role", "impact", "team", "challenge"],
    restaurant: ["order", "recommend", "allergy", "drink", "confirm"],
    meeting: ["progress", "blocker", "timeline", "action", "owner"],
    travel: ["hotel", "check", "transport", "trip", "reservation"],
    hotel: ["reservation", "check", "room", "quiet", "night"],
    airport: ["flight", "gate", "bag", "boarding", "delay"],
    medical: ["feel", "pain", "doctor", "medicine", "symptom"],
    campus: ["course", "class", "study", "assignment", "partner"],
    report: ["progress", "finished", "issue", "next", "plan"],
    email: ["email", "request", "deadline", "reply", "please"],
    project: ["project", "task", "deadline", "risk", "team"],
    academic: ["opinion", "reason", "research", "example", "study"],
    support: ["problem", "issue", "help", "solution", "confirm"],
    social: ["name", "hobby", "interest", "meet", "share"],
    hobby: ["hobby", "enjoy", "like", "because", "time"],
    emotion: ["feel", "happy", "tired", "sad", "because"],
    opinion: ["think", "agree", "reason", "example", "view"],
    story: ["happened", "first", "then", "learned", "experience"],
    plan: ["plan", "going", "next", "time", "goal"],
    transport: ["bus", "train", "ticket", "time", "take"],
    emergency: ["help", "emergency", "lost", "call", "need"],
    complaint: ["problem", "report", "resolve", "refund", "affected"]
  }[scenarioId] || ["say", "think", "feel", "want", "need"]);
  const relevanceHits = keywords.filter((keyword) => lower.includes(keyword)).length;
  const fluency = clamp(86 - fillers * 7 + Math.min(wordsInAnswer.length, 35) * 0.25, 45, 98);
  const grammar = clamp(92 - corrections.length * 8, 42, 98);
  const relevance = mode === "freeChat"
    ? clamp(64 + relevanceHits * 6 + Math.min(wordsInAnswer.length, 28) * 0.45, 48, 98)
    : clamp(56 + relevanceHits * 12 + Math.min(wordsInAnswer.length, 24) * 0.5, 42, 98);
  const pronunciation = clamp(62 + Math.min(wordsInAnswer.length, 30) * 0.8 - fillers * 4, 42, 98);
  return {
    fluency: Math.round(fluency),
    grammar: Math.round(grammar),
    relevance: Math.round(relevance),
    pronunciation: Math.round(pronunciation),
    overall: Math.round((fluency + grammar + relevance + pronunciation) / 4),
    corrections
  };
}

function nextCoachLine(scenarioId, count, mode = "scenario") {
  if (mode === "freeChat") {
    const lines = [
      "That sounds interesting. Can you tell me a little more about it?",
      "I see. How did that make you feel?",
      "That is a good topic to practice. What happened next?",
      "Thanks for sharing that. What would you like to say about it next?"
    ];
    return lines[count % lines.length];
  }
  const lines = {
    daily_chat: ["What made today special?", "Could you add one small detail?", "How did you feel about it?"],
    self_intro: ["Could you add one detail about your background?", "What hobby would you like to mention?", "How would you make it warmer?"],
    directions: ["Could you confirm the route?", "How would you ask if it is far?", "Could you repeat the destination politely?"],
    shopping: ["Could you ask about the size?", "How would you ask for the price?", "Could you confirm your purchase?"],
    interview: ["Could you make that more specific?", "What did you learn from that experience?", "How would you summarize your strengths?"],
    restaurant: ["Would you like to confirm the order?", "Do you have any dietary needs?", "Could you ask for a recommendation?"],
    meeting: ["What is the next action item?", "Who should own that task?", "How should the timeline change?"],
    travel: ["Could you ask about the check-in time?", "How would you confirm your reservation?", "Could you ask for directions politely?"],
    hotel: ["Could you confirm your reservation?", "How would you ask for a quiet room?", "Could you ask about check-out time?"],
    airport: ["Could you ask where the gate is?", "How would you ask about your baggage?", "Could you ask if the flight is delayed?"],
    medical: ["Could you describe the symptom?", "How long have you felt this way?", "Could you ask what you should do next?"],
    campus: ["Could you explain your study plan?", "How would you ask a classmate for help?", "Could you share one opinion about the course?"],
    report: ["Could you add one result?", "What is your next step?", "Could you explain one blocker?"],
    email: ["Could you make the request clearer?", "What deadline should you mention?", "How would you make it polite?"],
    project: ["Who should own that task?", "What is the timeline?", "Could you mention one risk?"],
    academic: ["Could you add one reason?", "What example supports your point?", "How would you respond to another view?"],
    support: ["Could you describe the problem more clearly?", "What solution would you like to request?", "How would you confirm the next step?"],
    social: ["Could you add one detail about your hobby?", "How would you ask a friendly follow-up question?", "Could you make the introduction warmer?"],
    hobby: ["Why do you enjoy it?", "When did you start this hobby?", "Could you ask the other person about their hobby?"],
    emotion: ["What made you feel that way?", "What would help you feel better?", "Could you describe it with one more detail?"],
    opinion: ["Could you add one reason?", "What example supports your opinion?", "How would you disagree politely?"],
    story: ["What happened next?", "How did you feel at that moment?", "What did you learn from it?"],
    plan: ["When will you start?", "What is the next step?", "Who will join you?"],
    transport: ["How would you ask about the ticket price?", "Could you confirm the travel time?", "What transport do you prefer?"],
    emergency: ["Could you say where you are?", "What help do you need first?", "Could you make the request clearer?"],
    complaint: ["Could you explain the impact?", "What solution do you want?", "How would you keep it polite?"]
  };
  const selectedLines = lines[scenarioId] || lines.daily_chat;
  return selectedLines[count % selectedLines.length];
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
