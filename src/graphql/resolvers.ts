import { prisma } from '@/lib/prisma';
import { getAllBrands, getBrandBySlug } from '@/lib/brands';

export const resolvers = {
  Query: {
    brands: () => {
      const brands = getAllBrands();
      return brands.map((b, i) => ({ id: i + 1, name: b.name, models: b.models }));
    },
    brand: (_: any, { name }: { name: string }) => {
      const brand = getBrandBySlug(name);
      if (!brand) return null;
      return { id: 1, name: brand.name, models: brand.models.map((m, i) => ({ id: i + 1, name: m.name, series: m.series })) };
    },
    cities: () => prisma.city.findMany(),
    city: (_: any, { slug }: { slug: string }) =>
      prisma.city.findUnique({ where: { slug } }),
  },
};
