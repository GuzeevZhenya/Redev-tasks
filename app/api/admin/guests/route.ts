import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TOKEN = process.env.ADMIN_TOKEN || 'wedding-secret-2024';

function checkAuth(req: Request) {
  return req.headers.get('x-admin-token') === TOKEN;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const guests = await prisma.guest.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(guests);
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, uniqueLink } = body;
    if (!name || !email || !uniqueLink) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    const guest = await prisma.guest.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), uniqueLink: uniqueLink.trim() }
    });

    return NextResponse.json({ success: true, guest }, { status: 201 });
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Email или ссылка уже заняты' }, { status: 400 });
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}