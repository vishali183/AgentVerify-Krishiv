import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    if (process.platform === 'win32' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.resolve(
        process.cwd(),
        '..',
        'backend',
        'node_modules',
        '.prisma',
        'client',
        'query_engine-windows.dll.node',
      );
    }
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}
