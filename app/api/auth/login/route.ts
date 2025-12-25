import { NextResponse } from 'next/server';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const setCookie = apiRes.headers['set-cookie'];

    // Якщо бекенд не повернув куки — 401
    if (!setCookie) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Формуємо відповідь з оригінальним body і статусом
    const response = new NextResponse(
      JSON.stringify(apiRes.data),
      { status: apiRes.status }
    );

    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

for (const cookieStr of cookieArray) {
  const parsed = parse(cookieStr);
  const name = Object.keys(parsed)[0];
  const value = parsed[name];

  if (!value) continue;

  response.cookies.set(name, value, {
    path: parsed.Path,
    expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
    maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
  });
}


    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return new NextResponse(
        JSON.stringify(error.response?.data),
        { status: error.response?.status || 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
