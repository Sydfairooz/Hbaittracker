import { prisma } from './db';

export async function logActivity(userId: string, action: string, metadata?: object) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    }
  });
}
