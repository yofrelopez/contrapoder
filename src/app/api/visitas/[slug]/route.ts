import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/').pop()
  if (!slug) {
    return NextResponse.json({ error: 'Slug no encontrado' }, { status: 400 })
  }

  const views = await redis.incr(`noticia:visitas:${slug}`)
  return NextResponse.json({ views })
}

export const dynamic = 'force-dynamic'

