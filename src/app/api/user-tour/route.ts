// app/api/user-tour/route.ts
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/server/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user = await getCurrentUser()
  const userId = user?.id;
  const pageName = searchParams.get("pageName");

  if (!userId || !pageName) {
    return NextResponse.json(
      { error: "userId and pageName required" }, 
      { status: 400 }
    );
  }

  try {
    // Cari record user_tour berdasarkan userId dan pageName
    const userTour = await prisma.userTour.findUnique({
      where: {
        userId_pageName: { 
          userId: parseInt(userId),
          pageName: pageName,
        },
      },
    });

    const seen = userTour?.seen || false;

    return NextResponse.json({ userId, pageName, seen });
  } catch (error) {
    console.error("Error fetching user tour:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const user = await getCurrentUser()
    const userId = user?.id ? parseInt(user?.id) : null;
    const { pageName } = body;

    if (!userId || !pageName) {
        return NextResponse.json(
            { error: "userId, pageName, and seen required" }, 
            { status: 400 }
        );
    }

    try {
        // Upsert: update kalo ada, create kalo belum ada
        const userTour = await prisma.userTour.upsert({
            where: {
                userId_pageName: {
                    userId: userId,
                    pageName: pageName,
                },
            },
            update: {
                seen: true,
                updatedAt: new Date(),
            },
            create: {
                userId: userId,
                pageName: pageName,
                seen: true,
            },
        });

        return NextResponse.json({ 
            success: true, 
            userId, 
            pageName, 
            seen: true
        });
    } catch (error) {
        console.error("Error updating user tour:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}