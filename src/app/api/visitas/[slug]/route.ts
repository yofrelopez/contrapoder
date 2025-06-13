import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// el segundo parámetro debe llamarse "context" y tiparse como { params: { slug: string } }
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params
  const views = await redis.incr(`noticia:visitas:${slug}`)
  return NextResponse.json({ views })
}

export const dynamic = 'force-dynamic'

