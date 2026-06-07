export const runtime = "nodejs";

const fallbackModel = "gpt-4o-mini";

const feedbackSchema = {
  type: "object",
  additionalProperties: false,
  required: ["scores", "corrections", "betterExpression", "nextQuestion", "summary", "gentleCorrection"],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: ["overall", "fluency", "grammar", "relevance", "pronunciation"],
      properties: {
        overall: { type: "integer" },
        fluency: { type: "integer" },
        grammar: { type: "integer" },
        relevance: { type: "integer" },
        pronunciation: { type: "integer" }
      }
    },
    corrections: {
      type: "array",
      items: { type: "string" }
    },
    betterExpression: { type: "string" },
    nextQuestion: { type: "string" },
    summary: {
      type: "object",
      additionalProperties: false,
      required: ["strength", "rewrite", "nextFocus"],
      properties: {
        strength: { type: "string" },
        rewrite: { type: "string" },
        nextFocus: { type: "string" }
      }
    },
    gentleCorrection: {
      type: "object",
      additionalProperties: false,
      required: ["praise", "original", "suggestion", "reason"],
      properties: {
        praise: { type: "string" },
        original: { type: "string" },
        suggestion: { type: "string" },
        reason: { type: "string" }
      }
    }
  }
};

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured. Local rule feedback was used instead." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.answer || !body?.scenario) {
    return Response.json({ error: "Missing answer or scenario." }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL || fallbackModel;
  const prompt = buildFeedbackPrompt(body);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "You are SpeakLab, a warm but precise English speaking coach. Return only valid JSON that matches the requested schema. UI-facing explanations must be in Simplified Chinese. English rewrites and next questions must be natural English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "speaking_feedback",
            strict: true,
            schema: feedbackSchema
          }
        },
        max_output_tokens: 900
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      const detail = await response.text();
      return Response.json(
        { error: "AI feedback request failed.", detail: detail.slice(0, 500) },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const text = extractOutputText(payload);
    const feedback = JSON.parse(text);

    return Response.json({
      model,
      feedback: normalizeFeedback(feedback)
    });
  } catch (error) {
    return Response.json(
      { error: "AI feedback could not be generated.", detail: error.message },
      { status: 500 }
    );
  }
}

function buildFeedbackPrompt({ answer, scenario, localAnalysis }) {
  return [
    `练习场景：${scenario.label} / ${scenario.title}`,
    `中文任务：${scenario.prompt}`,
    `练习目标：${scenario.goal}`,
    `必说点：${scenario.mustSay?.join("、") || "无"}`,
    `可用句型：${scenario.patterns?.join(" | ") || "无"}`,
    `本地规则初评分：${JSON.stringify(localAnalysis || {})}`,
    "",
    "用户英文回答：",
    answer,
    "",
    "请完成：",
    "1. 根据场景任务、必说点、语法、自然度和完整度给出 0-100 分。",
    "2. corrections 用中文给出 1-4 条具体、可执行的建议，不要泛泛而谈。",
    "3. betterExpression 给出一版更自然的英文改写，保持用户原意。",
    "4. nextQuestion 给出一句适合继续追问的英文教练问题。",
    "5. summary.strength、summary.rewrite、summary.nextFocus 用中文写，rewrite 字段可以说明改写理由。",
    "6. gentleCorrection 必须采用温柔纠错结构：praise 先肯定用户，original 摘出用户原句中最需要改的一小段，suggestion 给出更自然英文，reason 用中文解释为什么。"
  ].join("\n");
}

function extractOutputText(payload) {
  if (payload.output_text) return payload.output_text;

  const texts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) texts.push(content.text);
      if (content.type === "text" && content.text) texts.push(content.text);
    }
  }

  if (!texts.length) {
    throw new Error("No text output returned by model.");
  }
  return texts.join("\n");
}

function normalizeFeedback(feedback) {
  const scores = feedback.scores || {};
  return {
    fluency: clampScore(scores.fluency),
    grammar: clampScore(scores.grammar),
    relevance: clampScore(scores.relevance),
    pronunciation: clampScore(scores.pronunciation),
    overall: clampScore(scores.overall),
    corrections: ensureList(feedback.corrections),
    betterExpression: String(feedback.betterExpression || "").trim(),
    nextQuestion: String(feedback.nextQuestion || "").trim(),
    summary: {
      strength: String(feedback.summary?.strength || "").trim(),
      rewrite: String(feedback.summary?.rewrite || "").trim(),
      nextFocus: String(feedback.summary?.nextFocus || "").trim()
    },
    gentleCorrection: {
      praise: String(feedback.gentleCorrection?.praise || "").trim(),
      original: String(feedback.gentleCorrection?.original || "").trim(),
      suggestion: String(feedback.gentleCorrection?.suggestion || "").trim(),
      reason: String(feedback.gentleCorrection?.reason || "").trim()
    }
  };
}

function ensureList(value) {
  if (!Array.isArray(value)) return ["AI 已生成反馈，但建议内容格式不完整。"];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 4);
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}
