import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { link, willAttend, guestsCount, message } = body;

    if (!link || !['true', 'false'].includes(willAttend)) {
      return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
    }

    await prisma.guest.update({
      where: { uniqueLink: link },
      data: {
        hasResponded: true,
        willAttend: willAttend === 'true',
        guestsCount: willAttend === 'true' ? Number(guestsCount) : null,
        message: message?.toString().trim() || null,
        respondedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, message: 'Ответ сохранён!' });
  } catch (e) {
    return NextResponse.json({ error: 'Не удалось сохранить ответ' }, { status: 500 });
  }
}