import { createServerFn } from "@tanstack/react-start";

import type { Answers, Recommendation } from "./decision";
import type { Lang } from "./i18n";

export type AiExplanation = {
  summary: string;
  missingInformation: string[];
  cautions: string[];
  nextStep: string;
  model: "gpt-5.6";
};

type AiExplanationInput = {
  answers: Answers;
  recommendation: Pick<Recommendation, "method" | "fit" | "reasons" | "assumptions">;
  lang: Lang;
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    missingInformation: { type: "array", items: { type: "string" }, maxItems: 4 },
    cautions: { type: "array", items: { type: "string" }, maxItems: 4 },
    nextStep: { type: "string" },
  },
  required: ["summary", "missingInformation", "cautions", "nextStep"],
} as const;

function parseOutputText(payload: {
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
}) {
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  throw new Error("GPT-5.6 returned no text output.");
}

export const getAiExplanation = createServerFn({ method: "POST" })
  .validator((input: AiExplanationInput) => input)
  .handler(async ({ data }): Promise<AiExplanation> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_NOT_CONFIGURED");
    }

    const language = data.lang === "el" ? "Greek" : "English";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        reasoning: { effort: "low" },
        instructions: [
          "You are the explanation layer of an educational statistical decision-support tool.",
          "The deterministic rules engine has already selected the method. Do not replace or contradict that method.",
          "Explain the fit, identify genuinely missing design information, state concise cautions, and propose one practical next step.",
          "Never claim that the recommendation guarantees validity. Never invent sample facts, variables, results, citations, or software output.",
          `Write all user-facing text in ${language}.`,
        ].join(" "),
        input: JSON.stringify(data),
        max_output_tokens: 900,
        text: {
          format: {
            type: "json_schema",
            name: "statistical_explanation",
            strict: true,
            schema,
          },
        },
      }),
    });

    if (!response.ok) {
      const requestId = response.headers.get("x-request-id");
      console.error("OpenAI Responses API error", response.status, requestId);
      throw new Error("AI_REQUEST_FAILED");
    }

    const payload = (await response.json()) as {
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const parsed = JSON.parse(parseOutputText(payload)) as Omit<AiExplanation, "model">;
    return { ...parsed, model: "gpt-5.6" };
  });
