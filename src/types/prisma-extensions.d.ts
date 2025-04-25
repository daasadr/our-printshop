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
  }

  interface ProductWhereInput {
    categoryId?: string;
  }

  interface ProductInclude {
    category?: boolean;
  }
} 