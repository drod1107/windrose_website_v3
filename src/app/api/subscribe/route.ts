import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  hp: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);
  if (!result.success || result.data.hp) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      {
        status: 400,
      },
    );
  }
  const { email, source } = result.data;
  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already subscribed",
      });
    }
    await prisma.subscriber.create({ data: { email, source } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
