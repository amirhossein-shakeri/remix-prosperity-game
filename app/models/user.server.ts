import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getUserNextLevelNumber(userId: string) {
  const lastLevel = await prisma.level.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return lastLevel ? lastLevel.number + 1 : 1;
}

export const getUserCurrentLevel = async (userId: string) =>
  (
    await prisma.level.aggregate({
      _max: { number: true },
      where: { userId },
    })
  )._max.number ?? 0;

export const countUserItems = async (userId: string) =>
  (
    await prisma.item.aggregate({
      _count: { _all: true },
      where: { userId },
    })
  )._count._all ?? 0;

export const totalUserItemsCost = async (userId: string) =>
  (
    await prisma.item.aggregate({
      _sum: { price: true },
      where: { userId },
    })
  )._sum.price ?? 0;

export const totalUserWastedCost = async (userId: string) => 0;
