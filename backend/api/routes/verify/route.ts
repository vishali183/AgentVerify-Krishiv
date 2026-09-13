import { NextResponse } from 'next/server';
import { verifyAgentDelivery } from '../../../lib/verification/engine';
import { Requirement } from '../../../lib/verification/requirements';
import { validateVerificationRequest } from '../../../lib/verification/schema';
import { persistVerification } from '../../../lib/persistence/verification';
import { requireAuth } from '../../../lib/auth/request';
import { assessWithOpenAI } from '../../../lib/ai/semantic';

export async function POST(request: Request) {
  try {
    if (process.env.AUTH_REQUIRED === 'true') {
      const auth = requireAuth(request, ['ADMIN', 'OPERATOR']);
      if (auth instanceof NextResponse) return auth;
    }
    const body = await request.json();
    const validation = validateVerificationRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const { request: requestText, response, requirements = [], evidence = [] } = body as {
      request: string;
      response: string;
      requirements?: Requirement[];
      evidence?: Array<{ label: string; value: string }>;
      providerAgentId?: string;
      buyerAgent?: string;
    };

    const result = verifyAgentDelivery(requestText, response, requirements, evidence);
    const semantic = await assessWithOpenAI({ request: requestText, response, result });
    let persistence = null;
    let persistenceError: string | null = null;
    if (process.env.DATABASE_URL) {
      try {
        persistence = await persistVerification({
          requestText,
          responseText: response,
          requirements,
          evidence,
          result,
          providerExternalId: body.providerAgentId,
          buyerAgent: body.buyerAgent,
        });
      } catch (error) {
        persistenceError = error instanceof Error ? error.message : 'Database persistence unavailable.';
        if (process.env.DEMO_MODE !== 'true') throw error;
      }
    }

    return NextResponse.json({
      ok: true,
      result,
      mode: persistence ? 'database' : 'demo',
      persistence: persistence
        ? { persisted: true, verificationId: persistence.id }
        : { persisted: false, reason: persistenceError || 'DATABASE_URL is not configured.' },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unexpected verification failure.'],
      },
      { status: 500 },
    );
  }
}
