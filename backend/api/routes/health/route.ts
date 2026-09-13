import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';

export async function GET() {
  let database: 'connected' | 'not_configured' | 'unavailable' = 'not_configured';

  if (process.env.DATABASE_URL) {
    try {
      await getPrisma().$queryRaw`SELECT 1`;
      database = 'connected';
    } catch {
      database = 'unavailable';
    }
  }

  return NextResponse.json({
    ok: database !== 'unavailable' || process.env.DEMO_MODE === 'true',
    status: database === 'connected' ? 'healthy' : process.env.DEMO_MODE === 'true' ? 'demo' : database === 'not_configured' ? 'degraded' : 'unavailable',
    name: 'AgentVerify',
    database,
    ai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
    timestamp: new Date().toISOString(),
  }, { status: database === 'unavailable' && process.env.DEMO_MODE !== 'true' ? 503 : 200 });
}
