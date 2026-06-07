export const runtime = "nodejs";

const fallbackModel = "gpt-4o-mini";

const scaffoldSchema = {
  type: "object",
  additionalProperties: false,
  required: ["simple", "natural", "formal", "practiceTip"],
  properties: {
    simple: { type: "string" },
    natural: { type: "string" },
    formal: { type: "string" },
    practiceTip: { type: "string" }
  }
};

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured. Local scaffold fallback should be used." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.idea || !body?.scenario) {
    return Response.json({ error: "Missing idea or scenario." }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL || fallbackModel;

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
              "You are SpeakLab, a supportive English speaking coach for Chinese learners. Return only valid JSON. English expressions must be concise and speakable. The practice tip must be Simplified Chinese."
          },
          {
            role: "user",
            content: buildScaffoldPrompt(body)
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "expression_scaffold",
            strict: true,
            schema: scaffoldSchema
          }
        },
        max_output_tokens: 600
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      const detail = await response.text();
      return Response.json(
        { error: "AI scaffold request failed.", detail: detail.slice(0, 500) },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const scaffold = JSON.parse(extractOutputText(payload));
    return Response.json({ model, scaffold: normalizeScaffold(scaffold) });
  } catch (error) {
    return Response.json(
      { error: "AI scaffold could not be generated.", detail: error.message },
      { status: 500 }
    );
  }
}

function buildScaffoldPrompt({ idea, scenario }) {
  return [
    `练习场景：${scenario.label} / ${scenario.title}`,
    `场景任务：${scenario.prompt}`,
    `练习目标：${scenario.goal}`,
    `可用句型：${scenario.patterns?.join(" | ") || "无"}`,
    "",
    `用户中文想法：${idea}`,
    "",
    "请把这个中文想法转换成三种可直接开口练习的英文表达：",
    "simple: 初中级也能说出来的简单版，一句话。",
    "natural: 更自然口语版，一到两句话。",
    "formal: 更正式/面试/会议可用版，一到两句话。",
    "practiceTip: 用中文给一个开口提示，提醒用户先说哪一句。"
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

function normalizeScaffold(scaffold) {
  return {
    simple: String(scaffold.simple || "").trim(),
    natural: String(scaffold.natural || "").trim(),
    formal: String(scaffold.formal || "").trim(),
    practiceTip: String(scaffold.practiceTip || "").trim()
  };
}
