import { Prisma } from '@prisma/client';

declare module '@prisma/client' {
  export interface PrismaClient {
    category: Prisma.CategoryDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
    product: Prisma.ProductDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
  }

  export interface ProductWhereInput {
    categoryId?: string;
  }

  export interface ProductInclude {
    category?: boolean;
  }
} 