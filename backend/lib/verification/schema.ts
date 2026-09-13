import Ajv, { ErrorObject } from 'ajv';

export type VerificationRequest = {
  request?: string;
  requirements?: Array<{ id: string; description: string; required?: boolean; weight?: number }>;
  response?: string;
  evidence?: Array<{ label: string; value: string }>;
  schema?: Record<string, unknown>;
};

export function validateVerificationRequest(payload: unknown): { valid: boolean; errors: string[] } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be a JSON object.'] };
  }

  const request = payload as VerificationRequest;
  const errors: string[] = [];

  if (!request.request || typeof request.request !== 'string' || request.request.trim().length < 12) {
    errors.push('Request must be a non-empty string with at least 12 characters.');
  }

  if (!request.response || typeof request.response !== 'string' || request.response.trim().length < 12) {
    errors.push('Response must be a non-empty string with at least 12 characters.');
  }

  if (request.schema && typeof request.schema !== 'object') {
    errors.push('Schema must be a JSON object when supplied.');
  }

  if (request.schema) {
    try {
      const ajv = new Ajv({ allErrors: true, strict: false });
      const valid = ajv.validateSchema(request.schema as Record<string, unknown>);
      if (!valid) {
        const schemaErrors = ajv.errors || [];
        errors.push(...schemaErrors.map((error: ErrorObject) => `${error.instancePath || '/'} ${error.message || 'schema invalid'}`));
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Schema validation failed.');
    }
  }

  return { valid: errors.length === 0, errors };
}
