import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const res = await fetch(`${url}/incr/dev-toolbox:visits:global`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json({ count: data.result ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export const dynamic = "force-dynamic";
