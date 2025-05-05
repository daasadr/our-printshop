declare module '@prisma/client' {
  interface PrismaClient {
    category: {
      findMany: () => Promise<Category[]>;
      findUnique: (args: { where: { name: string } }) => Promise<Category | null>;
    };
    product: {
      findMany: (args: { where?: ProductWhereInput; include?: ProductInclude }) => Promise<Product[]>;
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