import { VerificationResult } from '../verification/engine';

type SemanticAssessment = {
  enabled: boolean;
  provider: 'openai' | 'deterministic';
  notes: string[];
  confidence: number | null;
};

export async function assessWithOpenAI(input: {
  request: string;
  response: string;
  result: VerificationResult;
}): Promise<SemanticAssessment> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      enabled: false,
      provider: 'deterministic',
      notes: ['OpenAI semantic checks are disabled because OPENAI_API_KEY is not configured.'],
      confidence: null,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Evaluate conservatively. Return only JSON with notes (string[]) and confidence (integer 0-100). Never invent evidence.' },
          { role: 'user', content: JSON.stringify({ request: input.request, response: input.response, deterministic: input.result }) },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}.`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenAI returned an empty assessment.');
    const parsed = JSON.parse(content) as { notes?: unknown; confidence?: unknown };
    return {
      enabled: true,
      provider: 'openai',
      notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note): note is string => typeof note === 'string').slice(0, 10) : [],
      confidence: typeof parsed.confidence === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.confidence))) : null,
    };
  } catch (error) {
    return {
      enabled: false,
      provider: 'deterministic',
      notes: [error instanceof Error ? error.message : 'OpenAI assessment failed.'],
      confidence: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
