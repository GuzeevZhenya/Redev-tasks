import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    const { link } = await params;

    const guest = await prisma.guest.findUnique({
      where: { uniqueLink: link },
      select: { id: true, name: true, hasResponded: true, willAttend: true, guestsCount: true }
    });

    if (!guest) return NextResponse.json({ error: 'Приглашение не найдено' }, { status: 404 });
    return NextResponse.json(guest);
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}