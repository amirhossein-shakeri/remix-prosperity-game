import { Level } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Level } from "@prisma/client";

export const maxLevelCost = (levelNumber: number) => levelNumber * 1000;
export const calculateNewItemOrder = async (levelId: string) =>
  parseInt(
    String(
      (
        await prisma.item.aggregate({
          _max: { order: true },
          where: { levelId },
        })
      )._max.order
    )
  ) + 1;

export const levelItemsCost = async (levelId: string) =>
  parseFloat(
    String(
      (
        await prisma.item.aggregate({
          _sum: { price: true },
          where: { levelId: levelId },
        })
      )._sum.price
    )
  );

export async function getUserLevels(userId: string) {
  return prisma.level.findMany({ where: { userId } });
}

export async function createLevel(
  level: Pick<Level, "note" | "number" | "userId">
) {
  return prisma.level.create({ data: level });
}
