import { Prisma } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    category: {
      findMany: () => Promise<any[]>;
      findUnique: (args: { where: { name: string } }) => Promise<any>;
    };
    product: {
      findMany: (args: any) => Promise<any[]>;
    };
    $transaction<T>(
      callback: (prisma: PrismaClient) => Promise<T>,
      options?: { maxWait?: number; timeout?: number }
    ): Promise<T>;
  }

  interface ProductWhereInput {
    categoryId?: string;
  }

  interface ProductInclude {
    category?: boolean;
  }
} 