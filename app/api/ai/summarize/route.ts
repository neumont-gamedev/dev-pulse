import OpenAI from "openai";
import { NextResponse } from "next/server";

type SummaryRequest = {
  workCompleted?: string;
  problemsEncountered?: string;
  blockers?: string;
  nextSteps?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SummaryRequest;
  const rawEntry = [
    `Work completed: ${body.workCompleted ?? ""}`,
    `Problems encountered: ${body.problemsEncountered ?? ""}`,
    `Blockers: ${body.blockers ?? ""}`,
    `Next steps: ${body.nextSteps ?? ""}`
  ].join("\n");

  if (!body.workCompleted?.trim()) {
    return NextResponse.json({ error: "workCompleted is required." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      rawEntry,
      summary: createFallbackSummary(body),
      source: "fallback"
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Summarize student devlog entries for an instructor dashboard. Preserve the student's meaning, do not invent progress, and keep the summary to one concise sentence."
      },
      {
        role: "user",
        content: rawEntry
      }
    ],
    temperature: 0.2,
    max_tokens: 80
  });

  return NextResponse.json({
    rawEntry,
    summary: completion.choices[0]?.message.content ?? createFallbackSummary(body),
    source: "openai"
  });
}

function createFallbackSummary(body: SummaryRequest) {
  const blockerText = body.blockers && body.blockers !== "None." ? ` Blocker: ${body.blockers}` : "";
  return `${body.workCompleted}${blockerText}`.trim();
}
