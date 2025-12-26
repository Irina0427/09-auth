import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const setCookie = apiRes.headers['set-cookie'];

    if (!setCookie) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const response = new NextResponse(JSON.stringify(apiRes.data), {
      status: apiRes.status,
    });

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
      logErrorResponse(error.response?.data);
      return new NextResponse(
        JSON.stringify({ error: error.response?.data?.message ?? 'Login failed' }),
        { status: error.response?.status ?? 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
