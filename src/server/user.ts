"use server";

import { PrismaClient, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function GetUsers() {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
}

export async function UpdateUser(id: string, data: { name: string; email: string; role: string }) {
  const prisma = new PrismaClient();

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
      },
    });
    revalidatePath("/user");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user");
  }
}

export async function DeleteUser(id: string) {
  const prisma = new PrismaClient();

  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/user");
  } catch (error) {
    throw new Error("Failed to delete user");
  }
}

export async function CreateUser(data: { name: string; email: string; role: string }) {
  const prisma = new PrismaClient();

  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
      },
    });
    revalidatePath("/user");
  } catch (error) {
    throw new Error("Failed to create user");
  }
}