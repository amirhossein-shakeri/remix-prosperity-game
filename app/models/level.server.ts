import { Level } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Level } from "@prisma/client";

export const maxLevelCost = (levelNumber: number) => levelNumber * 1000;
export const calculateNewItemOrder = async (levelId: string) =>
  ((
    await prisma.item.aggregate({
      _max: { order: true },
      where: { levelId },
    })
  )._max.order ?? 0) + 1;

export const levelItemsCost = async (levelId: string) =>
  (
    await prisma.item.aggregate({
      _sum: { price: true },
      where: { levelId: levelId },
    })
  )._sum.price ?? 0;

export async function getUserLevels(userId: string) {
  return prisma.level.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLevel(
  level: Pick<Level, "note" | "number" | "userId">
) {
  return prisma.level.create({ data: level });
}
