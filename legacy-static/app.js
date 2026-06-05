const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const scenarios = {
  interview: {
    title: "Interview Warm-up",
    name: "面试",
    description: "自我介绍、项目经历、追问与澄清。",
    goals: ["experience", "strength", "project", "challenge", "impact"],
    prompts: [
      "Thanks for joining today. Could you briefly introduce yourself and your recent work?",
      "Tell me about one project you are proud of. What was your role?",
      "How did you handle a challenge or conflict during that project?",
      "Why are you interested in this position?",
      "Do you have any questions for me about the role or team?",
      "Please summarize why you would be a strong fit in one minute.",
    ],
  },
  restaurant: {
    title: "Restaurant Ordering",
    name: "点餐",
    description: "询问推荐、表达偏好、确认订单。",
    goals: ["recommend", "order", "allergy", "price", "confirm"],
    prompts: [
      "Welcome. Would you like to hear today's specials?",
      "What would you like to order for your main course?",
      "Do you have any allergies or dietary preferences I should know about?",
      "Would you like a drink or dessert with that?",
      "Let me confirm your order. Could you repeat the key items?",
      "How would you like to pay?",
    ],
  },
  meeting: {
    title: "Project Meeting",
    name: "会议",
    description: "同步进展、表达观点、推进决策。",
    goals: ["update", "blocker", "suggest", "deadline", "action"],
    prompts: [
      "Let's start with your progress update. What has changed since our last meeting?",
      "Are there any blockers the team should discuss?",
      "What option would you recommend, and why?",
      "How should we adjust the timeline?",
      "Could you clarify the next action items and owners?",
      "Please close the meeting with a concise recap.",
    ],
  },
  travel: {
    title: "Travel Help Desk",
    name: "旅行",
    description: "问路、改签、处理突发问题。",
    goals: ["ticket", "direction", "delay", "help", "confirm"],
    prompts: [
      "How can I help you with your trip today?",
      "Could you explain where you need to go and when?",
      "There may be a delay. What alternative would you prefer?",
      "Do you need help with luggage, directions, or ticket changes?",
      "Please confirm the final plan.",
      "What else would you like to ask before you leave?",
    ],
  },
};

const state = {
  scenarioKey: "interview",
  round: 0,
  turns: [],
  recognition: null,
  listening: false,
  startedAt: 0,
  lastConfidence: 0.72,
};

const els = {
  scenarioList: document.querySelector("#scenarioList"),
  sessionTitle: document.querySelector("#sessionTitle"),
  speechStatus: document.querySelector("#speechStatus"),
  roundCounter: document.querySelector("#roundCounter"),
  messageLog: document.querySelector("#messageLog"),
  draftInput: document.querySelector("#draftInput"),
  micButton: document.querySelector("#micButton"),
  sendButton: document.querySelector("#sendButton"),
  resetButton: document.querySelector("#resetButton"),
  summaryButton: document.querySelector("#summaryButton"),
  speedRange: document.querySelector("#speedRange"),
  levelSelect: document.querySelector("#levelSelect"),
  correctionList: document.querySelector("#correctionList"),
  summaryBox: document.querySelector("#summaryBox"),
  overallScore: document.querySelector("#overallScore"),
  pronScore: document.querySelector("#pronScore"),
  fluencyScore: document.querySelector("#fluencyScore"),
  grammarScore: document.querySelector("#grammarScore"),
  relevanceScore: document.querySelector("#relevanceScore"),
};

function renderScenarios() {
  els.scenarioList.innerHTML = Object.entries(scenarios)
    .map(
      ([key, item]) => `
      <button class="scenario-card ${key === state.scenarioKey ? "active" : ""}" data-scenario="${key}" type="button">
        <strong>${item.name}</strong>
        <span>${item.description}</span>
      </button>
    `,
    )
    .join("");
}

function setScenario(key) {
  state.scenarioKey = key;
  resetSession();
}

function resetSession() {
  window.speechSynthesis.cancel();
  state.round = 0;
  state.turns = [];
  state.lastConfidence = 0.72;
  els.draftInput.value = "";
  els.sessionTitle.textContent = scenarios[state.scenarioKey].title;
  els.messageLog.innerHTML = "";
  renderScenarios();
  updateScores();
  renderCorrections([]);
  els.summaryBox.className = "summary-box empty";
  els.summaryBox.textContent = "至少完成 3 轮后生成可量化总结。";
  askNext();
}

function askNext() {
  const scenario = scenarios[state.scenarioKey];
  const prompt = scenario.prompts[state.round] || "Great. Please add one final thought.";
  addMessage("coach", prompt);
  speak(prompt);
  updateRoundCounter();
}

function addMessage(role, text) {
  const node = document.createElement("article");
  node.className = `message ${role === "coach" ? "coach-msg" : "user-msg"}`;
  node.innerHTML = `<small>${role === "coach" ? "Coach" : "You"}</small>${escapeHtml(text)}`;
  els.messageLog.appendChild(node);
  els.messageLog.scrollTop = els.messageLog.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    els.speechStatus.textContent = "当前浏览器不支持语音合成";
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = Number(els.speedRange.value);
  utterance.pitch = 1;
  utterance.onstart = () => (els.speechStatus.textContent = "教练正在发问");
  utterance.onend = () => (els.speechStatus.textContent = "等待你的回答");
  window.speechSynthesis.speak(utterance);
}

function setupRecognition() {
  if (!SpeechRecognition) {
    els.speechStatus.textContent = "当前浏览器不支持语音识别，可改用键盘输入";
    els.micButton.disabled = true;
    return;
  }

  state.recognition = new SpeechRecognition();
  state.recognition.lang = "en-US";
  state.recognition.interimResults = true;
  state.recognition.continuous = false;

  state.recognition.onstart = () => {
    state.listening = true;
    state.startedAt = performance.now();
    els.micButton.classList.add("recording");
    els.speechStatus.textContent = "正在聆听";
  };

  state.recognition.onresult = (event) => {
    let transcript = "";
    for (const result of event.results) {
      transcript += result[0].transcript;
      state.lastConfidence = result[0].confidence || state.lastConfidence;
    }
    els.draftInput.value = transcript.trim();
  };

  state.recognition.onerror = (event) => {
    els.speechStatus.textContent = `语音识别失败：${event.error}`;
  };

  state.recognition.onend = () => {
    state.listening = false;
    els.micButton.classList.remove("recording");
    els.speechStatus.textContent = "识别结束，可发送回答";
  };
}

function toggleMic() {
  if (!state.recognition) return;
  if (state.listening) {
    state.recognition.stop();
    return;
  }
  els.draftInput.value = "";
  window.speechSynthesis.cancel();
  state.recognition.start();
}

function submitAnswer() {
  const text = els.draftInput.value.trim();
  if (!text) return;

  const durationMs = state.startedAt ? performance.now() - state.startedAt : estimateDuration(text);
  const analysis = analyzeAnswer(text, durationMs);
  state.turns.push({ text, analysis, scenarioKey: state.scenarioKey });
  addMessage("user", text);
  renderCorrections(analysis.corrections);
  updateScores();
  els.draftInput.value = "";
  state.round += 1;
  updateRoundCounter();

  setTimeout(() => {
    if (state.round < scenarios[state.scenarioKey].prompts.length) {
      askNext();
    } else {
      const closing = "Session complete. Generate your summary when you are ready.";
      addMessage("coach", closing);
      speak(closing);
    }
  }, 450);
}

function analyzeAnswer(text, durationMs) {
  const words = text.match(/[A-Za-z']+/g) || [];
  const lower = text.toLowerCase();
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  const fillers = (lower.match(/\b(um|uh|like|you know|actually|basically)\b/g) || []).length;
  const wpm = words.length / Math.max(durationMs / 60000, 0.25);
  const corrections = buildCorrections(text);
  const keywordHits = scenarioKeywordHits(lower);
  const confidence = Math.max(0.48, Math.min(0.98, state.lastConfidence));

  const pronunciation = clamp(Math.round(confidence * 78 + Math.min(words.length, 28) * 0.5 - fillers * 3), 45, 98);
  const fluency = clamp(Math.round(82 - Math.abs(wpm - 115) * 0.18 - fillers * 5 + Math.min(words.length, 32) * 0.18), 42, 98);
  const grammar = clamp(92 - corrections.length * 9 - sentenceStartPenalty(text), 38, 98);
  const relevance = clamp(58 + keywordHits * 12 + Math.min(uniqueWords.size, 24) * 0.65, 42, 98);
  const overall = Math.round(pronunciation * 0.28 + fluency * 0.24 + grammar * 0.24 + relevance * 0.24);

  return { words: words.length, wpm: Math.round(wpm), fillers, pronunciation, fluency, grammar, relevance, overall, corrections };
}

function buildCorrections(text) {
  const checks = [
    {
      pattern: /\bi am agree\b/i,
      wrong: "I am agree",
      better: "I agree",
      reason: "agree 是动词，前面不需要 be 动词。",
    },
    {
      pattern: /\bdiscuss about\b/i,
      wrong: "discuss about",
      better: "discuss",
      reason: "discuss 后面可直接接宾语。",
    },
    {
      pattern: /\bmore better\b/i,
      wrong: "more better",
      better: "better",
      reason: "better 已经是比较级。",
    },
    {
      pattern: /\binformations\b/i,
      wrong: "informations",
      better: "information",
      reason: "information 通常作不可数名词。",
    },
    {
      pattern: /\bI very\b/i,
      wrong: "I very",
      better: "I am very / I really",
      reason: "very 需要修饰形容词或副词，句子需补足谓语。",
    },
    {
      pattern: /\bhe have\b/i,
      wrong: "he have",
      better: "he has",
      reason: "第三人称单数现在时需要 has。",
    },
    {
      pattern: /\bshe have\b/i,
      wrong: "she have",
      better: "she has",
      reason: "第三人称单数现在时需要 has。",
    },
  ];

  const corrections = checks.filter((check) => check.pattern.test(text));

  if ((text.match(/[A-Za-z']+/g) || []).length < 8) {
    corrections.push({
      wrong: "回答过短",
      better: "Use one reason and one detail.",
      reason: "真实对话中需要给出理由或例子，便于对方继续追问。",
    });
  }

  if (!/[.!?]$/.test(text.trim())) {
    corrections.push({
      wrong: "缺少句末停顿",
      better: "Add a clear sentence ending.",
      reason: "完整句能提升表达边界和语音停顿自然度。",
    });
  }

  return corrections.slice(0, 4);
}

function scenarioKeywordHits(lower) {
  const scenario = scenarios[state.scenarioKey];
  return scenario.goals.reduce((count, keyword) => count + (lower.includes(keyword) ? 1 : 0), 0);
}

function sentenceStartPenalty(text) {
  const starts = text
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return starts.some((sentence) => /^[a-z]/.test(sentence)) ? 6 : 0;
}

function updateScores() {
  const latest = state.turns.at(-1)?.analysis;
  const empty = latest ? null : "--";
  els.overallScore.textContent = latest?.overall ?? empty;
  els.pronScore.textContent = latest?.pronunciation ?? empty;
  els.fluencyScore.textContent = latest?.fluency ?? empty;
  els.grammarScore.textContent = latest?.grammar ?? empty;
  els.relevanceScore.textContent = latest?.relevance ?? empty;
}

function renderCorrections(corrections) {
  if (!corrections.length) {
    els.correctionList.className = "correction-list empty";
    els.correctionList.textContent = state.turns.length ? "本轮没有明显错误，继续保持具体表达。" : "完成一轮回答后显示建议。";
    return;
  }

  els.correctionList.className = "correction-list";
  els.correctionList.innerHTML = corrections
    .map(
      (item) => `
      <div class="correction">
        <strong>${escapeHtml(item.wrong)} → ${escapeHtml(item.better)}</strong>
        <span>${escapeHtml(item.reason)}</span>
      </div>
    `,
    )
    .join("");
}

function generateSummary() {
  if (state.turns.length < 3) {
    els.summaryBox.className = "summary-box empty";
    els.summaryBox.textContent = "请至少完成 3 轮对话后再生成总结。";
    return;
  }

  const avg = averageScores();
  const totalWords = state.turns.reduce((sum, turn) => sum + turn.analysis.words, 0);
  const totalFillers = state.turns.reduce((sum, turn) => sum + turn.analysis.fillers, 0);
  const allCorrections = state.turns.flatMap((turn) => turn.analysis.corrections);
  const focus = lowestScore(avg);

  els.summaryBox.className = "summary-box";
  els.summaryBox.innerHTML = `
    <strong>本次训练完成 ${state.turns.length} 轮，共 ${totalWords} 个词。</strong>
    <ul>
      <li>综合均分 ${avg.overall}，发音 ${avg.pronunciation}，流利度 ${avg.fluency}，语法 ${avg.grammar}，场景贴合 ${avg.relevance}。</li>
      <li>口头填充词 ${totalFillers} 次，建议下一轮控制在 ${Math.max(totalFillers - 1, 0)} 次以内。</li>
      <li>主要提升点：${focus.label}。建议用 “point + reason + example” 结构扩展回答。</li>
      <li>累计纠错 ${allCorrections.length} 条，优先复盘高频语法和回答完整度。</li>
    </ul>
  `;
}

function averageScores() {
  const fields = ["overall", "pronunciation", "fluency", "grammar", "relevance"];
  return Object.fromEntries(
    fields.map((field) => [
      field,
      Math.round(state.turns.reduce((sum, turn) => sum + turn.analysis[field], 0) / state.turns.length),
    ]),
  );
}

function lowestScore(avg) {
  const labels = {
    pronunciation: "发音清晰度",
    fluency: "语速与停顿",
    grammar: "语法准确度",
    relevance: "场景关键词和任务完成度",
  };
  const [key] = Object.entries(avg)
    .filter(([field]) => field !== "overall")
    .sort((a, b) => a[1] - b[1])[0];
  return { key, label: labels[key] };
}

function updateRoundCounter() {
  els.roundCounter.textContent = `${Math.min(state.round, scenarios[state.scenarioKey].prompts.length)} / ${scenarios[state.scenarioKey].prompts.length} rounds`;
}

function estimateDuration(text) {
  const words = text.match(/[A-Za-z']+/g) || [];
  return Math.max(words.length / 2.1, 2.5) * 1000;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

els.scenarioList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scenario]");
  if (button) setScenario(button.dataset.scenario);
});
els.micButton.addEventListener("click", toggleMic);
els.sendButton.addEventListener("click", submitAnswer);
els.resetButton.addEventListener("click", resetSession);
els.summaryButton.addEventListener("click", generateSummary);
els.draftInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) submitAnswer();
});

setupRecognition();
renderScenarios();
resetSession();
