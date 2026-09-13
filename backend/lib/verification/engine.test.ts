import { describe, expect, it } from 'vitest';
import { verifyAgentDelivery } from './engine';

describe('verifyAgentDelivery', () => {
  it('marks a delivery as verified when requirements, evidence, and structure match', () => {
    const result = verifyAgentDelivery(
      'Create a launch plan for a SaaS onboarding flow.',
      'The launch plan includes onboarding checklist, risk controls, and launch steps for a SaaS rollout. The plan is fully complete.',
      [
        { id: 'req-1', description: 'launch plan', required: true, weight: 3 },
        { id: 'req-2', description: 'risk controls', required: true, weight: 3 },
      ],
      [
        { label: 'Plan includes launch details', value: 'launch plan' },
        { label: 'Risk controls included', value: 'risk controls' },
      ],
    );

    expect(result.status).toBe('VERIFIED');
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
  });

  it('marks a refusal as refused when the response refuses to comply', () => {
    const result = verifyAgentDelivery(
      'Create a secure onboarding checklist.',
      'I cannot comply with this request and I refuse to provide the checklist.',
      [{ id: 'req-1', description: 'secure onboarding checklist', required: true, weight: 3 }],
      [],
    );

    expect(result.status).toBe('REFUSED');
  });
});
