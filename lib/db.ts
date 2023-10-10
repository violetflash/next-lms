import {PrismaClient} from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined
}

// globalThis is a global variable that can be accessed from anywhere
// and not affected by hot reloading in development which can cause issues
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}