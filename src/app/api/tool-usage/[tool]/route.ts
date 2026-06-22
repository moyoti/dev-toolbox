import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool } = await params;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ count: 0, tool });
  }

  try {
    const key = `dev-toolbox:visits:tool:${tool}`;
    const res = await fetch(`${url}/incr/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json({ count: data.result ?? 0, tool });
  } catch {
    return NextResponse.json({ count: 0, tool });
  }
}

export const dynamic = "force-dynamic";
