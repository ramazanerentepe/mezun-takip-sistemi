"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDepartmentsAction() {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc', // Listeyi A'dan Z'ye sıralı getirir
      },
    });
    
    return { success: true, data: departments };
  } catch (error) {
    console.error("Bölümler çekilirken hata oluştu:", error);
    return { success: false, data: [] };
  }
}