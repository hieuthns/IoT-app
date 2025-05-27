"use server";

import { PrismaClient } from "@prisma/client";

export async function GetLatestData() {
  const prisma = new PrismaClient();

  try {
    const latestData = await prisma.deviceData.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 1,
    });
    return latestData;
  } catch (error) {
    throw new Error("Failed to fetch latest data");
  }
}

export async function GetPeriodData(start: Date, end: Date) {
  const prisma = new PrismaClient();

  try {
    const periodData = await prisma.deviceData.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    return periodData;
  } catch (error) {
    throw new Error("Failed to fetch period data");
  }
}