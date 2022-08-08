import { Item } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Item } from "@prisma/client";

export const hasUserCreatedItemBefore = async (
  userId: string,
  title: string,
  url: string
) =>
  !!(await prisma.item.findFirst({
    where: {
      OR: [
        { userId, title },
        { userId, url },
      ],
    },
  }));

export const getLevelItems = async (levelId: string) =>
  prisma.item.findMany({ where: { levelId } });

export const getUserItems = async (userId: string) =>
  prisma.item.findMany({ where: { userId } });

export const getItemById = async (itemId: string) =>
  prisma.item.findUnique({ where: { id: itemId } });

export async function createItem(
  item: Pick<
    Item,
    "levelId" | "price" | "title" | "userId" | "url" | "description"
  >
) {
  return prisma.item.create({ data: { ...item, order: 1 } }); // TODO: calculate order
}

export const deleteItem = async (itemId: string) =>
  prisma.item.delete({ where: { id: itemId } });

export const updateItem = (
  item: Pick<
    Item,
    "id" | "levelId" | "price" | "title" | "userId" | "url" | "description"
  >
) => prisma.item.update({ data: item, where: { id: item.id } });
